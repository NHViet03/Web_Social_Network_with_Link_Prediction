from fastapi import APIRouter
from bson import ObjectId
from models.user import User
from config.db import userCollection
from schemas.user import suggestion_entity, userEntity, usersEntity
import networkx as nx
import numpy as np


user = APIRouter()


# Lấy tất cả user
@user.get("/GetAllUser")
def getAllUsers():
    user = userCollection.find()
    users_Entity = usersEntity(user)
    return {"status": "ok", "data": users_Entity}


# Tạo Graph user - done
def initGraph():
    users = userCollection.find({"role": "user"})
    nodes_list = []
    edges_list = []
    G_user = nx.DiGraph()
    for user in users:
        user_id = str(user["_id"])
        nodes_list.append(user_id)
        following = user["following"]
        for followed_user in following:
            followed_user_id = str(followed_user)
            edges_list.append([user_id, followed_user_id])
    G_user.add_nodes_from(nodes_list)
    G_user.add_edges_from(edges_list)
    return G_user


def generatePredictResponse(user_id, userSuggestions):
    predict_user_info = userEntity(userCollection.find_one({"_id": ObjectId(user_id)}))

    top5_predict_users = []
    for user in userSuggestions:
        user = suggestion_entity(user)
        # Get indirect following,
        # If A following B, B following C -> Suggest A follow C
        indirect_following = set(predict_user_info.get("following", [])) & set(
            user.get("followers", [])
        )

        indirect_following = [ObjectId(user) for user in indirect_following]

        print("Indirect: ", indirect_following)

        data = userCollection.find(
            {"_id": {"$in": indirect_following}}, {"_id": 1, "username": 1}
        )

        user["followers"] = [
            {"_id": str(f["_id"]), "username": f.get("username", "")} for f in data
        ]

        # Get direct following
        # If A following C, B also following C -> Suggest A follow B
        direct_following = set(predict_user_info.get("following", [])) & set(
            user.get("following", [])
        )

        direct_following = [ObjectId(user) for user in direct_following]

        data = userCollection.find(
            {"_id": {"$in": direct_following}}, {"_id": 1, "username": 1}
        )

        user["following"] = [
            {"_id": str(f["_id"]), "username": f.get("username", "")} for f in data
        ]

        top5_predict_users.append(user)

    return {"status": "ok", "data": top5_predict_users}

# Hàm common neighbour
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
    sorted_common_neighbours = sorted(
        common_neighbours.items(), key=lambda x: x[1], reverse=True
    )

    # Lấy 5 non-neighbor có số lượng hàng xóm chung lớn nhất
    top_5_common_non_neighbours = [
        non_neighbor for non_neighbor, count in sorted_common_neighbours[:5]
    ]

    return top_5_common_non_neighbours


@user.get("/SuggestionUserByCN{user_id}")
def getSuggestionUserByCN(user_id: str):
    # Tạo Graph user
    G_user = initGraph()
    top_5_user = top_common_non_neighbours(G_user, user_id)
    
    query = {
        "_id": {"$in": [ObjectId(user) for user in top_5_user]},
        "role": "user",
    }
    projection = {"_id": 1, "username": 1, "avatar": 1, "followers": 1, "following": 1}
    users_cursor = userCollection.find(filter=query, projection=projection)
    
    return generatePredictResponse(user_id, users_cursor)


# Hàm Jacard
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
    sorted_common_neighbours = sorted(
        common_neighbours.items(), key=lambda x: x[1], reverse=True
    )

    # Lấy 5 non-neighbor có hệ số Jaccard lớn nhất
    top_5_common_non_neighbours = [
        non_neighbor for non_neighbor, count in sorted_common_neighbours[:5]
    ]

    return top_5_common_non_neighbours


# Gới ý user bằng JC
@user.get("/SuggestionUserByJC{user_id}")
def getSuggestionUserByJC(user_id: str):
    # Tạo Graph user
    G_user = initGraph()

    top_5_user = top_jaccard_non_neighbours(G_user, user_id)
    
    query = {
        "_id": {"$in": [ObjectId(user) for user in top_5_user]},
        "role": "user",
    }
    
    projection = {"_id": 1, "username": 1, "avatar": 1, "followers": 1, "following": 1}
    users_cursor = userCollection.find(filter=query, projection=projection)
    
    return generatePredictResponse(user_id, users_cursor)

# Hàm Adamic-Adar
def adamic_adar_index(G, u, v):
    # Tìm các hàng xóm chung của node u và v
    neighbors_u = set(G.neighbors(u))
    neighbors_v = set(G.neighbors(v))
    common_neighbors = neighbors_u.intersection(neighbors_v)

    # Tính điểm Adamic-Adar
    aa_index = sum(1 / np.log10(G.degree(w)) for w in common_neighbors)

    return aa_index


def getTop5UserByAdamicAdar(predict_node: str):
    # Tạo Graph user
    G_users = initGraph()

    all_nodes = set(G_users.nodes())  # Lấy tất cả node trong đồ thị
    neighbor_nodes = set(
        G_users.neighbors(predict_node)
    )  # Các node hàng xóm của node dự đoán
    unconnected_nodes = (
        all_nodes - neighbor_nodes - {predict_node}
    )  # Các node chưa có liên kết với node dự đoán

    adamic_adar_scores = []

    for v in unconnected_nodes:
        score = adamic_adar_index(G_users, predict_node, v)
        adamic_adar_scores.append([predict_node, v, score])

    sorted_adamic_adar_scores = sorted(
        adamic_adar_scores, key=lambda x: x[2], reverse=True
    )
    top5_adamic_adar = np.array(sorted_adamic_adar_scores[:5])[:, 1]

    return top5_adamic_adar


# Dự đoán liên kết Adamic-Adar
@user.get("/SuggestionUserByAA{user_id}")
def getSuggestionUserByAA(user_id: str):
    userSuggestions = getTop5UserByAdamicAdar(user_id)

    query = {
        "_id": {"$in": [ObjectId(user) for user in userSuggestions]},
        "role": "user",
    }
    projection = {"_id": 1, "username": 1, "avatar": 1, "followers": 1, "following": 1}
    users_cursor = userCollection.find(filter=query, projection=projection)


    return generatePredictResponse(user_id, users_cursor)


# Hàm Katz Index
def katz_index_from_node(G, beta=0.1, target_node=None):
    # Tạo ma trận kề từ đồ thị
    A = nx.to_numpy_array(G)

    n = A.shape[0]
    I = np.eye(n)
    S = np.linalg.inv(I - beta * A) - I

    nodes = list(G.nodes())
    node_index = {node: idx for idx, node in enumerate(nodes)}
    target_index = node_index[target_node]
    katz_scores = S[target_index, :]
    neighbor_nodes = set(G.neighbors(target_node))

    # Loại các node đã có liên kết và chính node target
    results = []
    for i in range(n):
        if nodes[i] not in neighbor_nodes and nodes[i] != target_node:
            results.append((target_node, nodes[i], katz_scores[i]))

    return results


def getTop5UserByKatzIndex(predict_node: str):
    # Tạo Graph user
    G_users = initGraph()
    beta = 0.1
    katz_scores = katz_index_from_node(G_users, beta=beta, target_node=predict_node)

    sorted_katz_scores = sorted(katz_scores, key=lambda x: x[2], reverse=True)
    top5_katz_scores = np.array(sorted_katz_scores[:5])[:, 1]

    return top5_katz_scores


# Dự đoán liên kết Katz Index
@user.get("/SuggestionUserByKatz{user_id}")
def getSuggestionUserByKatz(user_id: str):

    userSuggestions = getTop5UserByKatzIndex(user_id)

    query = {
        "_id": {"$in": [ObjectId(user) for user in userSuggestions]},
        "role": "user",
    }
    projection = {"_id": 1, "username": 1, "avatar": 1, "followers": 1, "following": 1}
    users_cursor = userCollection.find(filter=query, projection=projection)
    
    return generatePredictResponse(user_id, users_cursor)
