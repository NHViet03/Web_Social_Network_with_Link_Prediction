from fastapi import APIRouter
from bson import ObjectId
from models.user import User
from config.db import userCollection
from schemas.user import userEntity, usersEntity
import networkx as nx

user = APIRouter()

# Lấy tất cả user
@user.get('/GetAllUser')
def getAllUsers():
    user = userCollection.find()
    users_Entity = usersEntity(user)
    return {
        "status": "ok",
        "data": users_Entity
    }

#Tạo Graph user - done
def initGraph():
    users = userCollection.find({"role": "user"})
    nodes_list = []
    edges_list = []
    G_user = nx.DiGraph()
    for user in users:
        user_id = str(user['_id'])
        nodes_list.append(user_id)
        following = user['following']
        for followed_user in following:
            followed_user_id = str(followed_user)
            edges_list.append([user_id, followed_user_id])  
    G_user.add_nodes_from(nodes_list)
    G_user.add_edges_from(edges_list)
    return G_user
 
 #Hàm common neighbour
def top_common_non_neighbours(graph, node):
    # Danh sách tất cả các node trong đồ thị
    all_nodes = set(graph.nodes())
    
    # Tập hợp các hàng xóm của node cho trước
    neighbors = set(graph.neighbors(node))
    
    # Tập hợp các node không phải là hàng xóm của node cho trước
    non_neighbors = all_nodes - neighbors - {node}
    
    # Dictionary lưu số lượng hàng xóm chung của mỗi non-neighbor
    common_neighbours = {}
    
    # Lặp qua từng non-neighbor
    for non_neighbor in non_neighbors:
        # Tập hợp các hàng xóm của non-neighbor
        non_neighbor_neighbors = set(graph.neighbors(non_neighbor))
        
        # Tính số lượng hàng xóm chung giữa node và non-neighbor
        common_count = len(neighbors.intersection(non_neighbor_neighbors))
        
        # Lưu số lượng hàng xóm chung vào dictionary
        common_neighbours[non_neighbor] = common_count
    
    # Sắp xếp dictionary theo số lượng hàng xóm chung giảm dần
    sorted_common_neighbours = sorted(common_neighbours.items(), key=lambda x: x[1], reverse=True)
    
    # Lấy 5 non-neighbor có số lượng hàng xóm chung lớn nhất
    top_5_common_non_neighbours = [non_neighbor for non_neighbor, count in sorted_common_neighbours[:5]]
    
    return top_5_common_non_neighbours

@user.get('/SuggestionUserByCN{user_id}')
def getSuggestionUserByCN( user_id: str):
    #Tạo Graph user
    G_user = initGraph()
    top_5_user = top_common_non_neighbours(G_user, user_id)
    # Lọc qua từng top 5 user để lấy thông tin user
    user_Entity = []
    for user_id in top_5_user:
        user = userCollection.find_one({"_id": ObjectId(user_id)})
        user_Entity.append(userEntity(user))
    return {
        "status": "ok",
        "data": user_Entity
    }

#Hàm Jacard
def top_jaccard_non_neighbours(graph, node):
    # Danh sách tất cả các node trong đồ thị
    all_nodes = set(graph.nodes())
    
    # Tập hợp các hàng xóm của node cho trước
    neighbors = set(graph.neighbors(node))
    
    # Tập hợp các node không phải là hàng xóm của node cho trước
    non_neighbors = all_nodes - neighbors - {node}
    
    # Dictionary lưu số lượng hàng xóm chung của mỗi non-neighbor
    common_neighbours = {}
    
    # Lặp qua từng non-neighbor
    for non_neighbor in non_neighbors:
        # Tập hợp các hàng xóm của non-neighbor
        non_neighbor_neighbors = set(graph.neighbors(non_neighbor))
        
        # Tính số lượng hàng xóm chung giữa node và non-neighbor
        common_count = len(neighbors.intersection(non_neighbor_neighbors))
        
        # Tính số lượng hàng xóm của node và non-neighbor
        union_count = len(neighbors.union(non_neighbor_neighbors))
        
        # Tính hệ số Jaccard
        jaccard = common_count / union_count
        
        # Lưu hệ số Jaccard vào dictionary
        common_neighbours[non_neighbor] = jaccard
    
    # Sắp xếp dictionary theo hệ số Jaccard giảm dần
    sorted_common_neighbours = sorted(common_neighbours.items(), key=lambda x: x[1], reverse=True)
    
    # Lấy 5 non-neighbor có hệ số Jaccard lớn nhất
    top_5_common_non_neighbours = [non_neighbor for non_neighbor, count in sorted_common_neighbours[:5]]
    
    return top_5_common_non_neighbours
# Gới ý user bằng JC
@user.get('/SuggestionUserByJC{user_id}')
def getSuggestionUserByJC( user_id: str):
    #Tạo Graph user
    G_user = initGraph()
    
    top_5_user = top_jaccard_non_neighbours(G_user, user_id)
    user_Entity = []
    for user_id in top_5_user:
        user = userCollection.find_one({"_id": ObjectId(user_id)})
        user_Entity.append(userEntity(user))
    return {
        "status": "ok",
        "data": user_Entity
    }