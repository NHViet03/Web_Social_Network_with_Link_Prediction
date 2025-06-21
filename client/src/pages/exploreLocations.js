import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../components/Loading";
import { getDataAPI } from "../utils/fetchData";
import GalleryPost from "../components/GalleryPost";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ExploreLocations = () => {
  const [position, setPosition] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const { auth } = useSelector((state) => ({
    auth: state.auth,
  }));

  const { id, name } = useParams();
  const pageEnd = useRef();

  useEffect(() => {
    if (!id) return;

    const getLocation = async () => {
      try {
        const data = await fetch(
          `https://google-map-places.p.rapidapi.com/maps/api/place/details/json?place_id=${id}&fields=geometry&language=vi`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "214ae9b6a7mshe2d8b5b63eacda2p179e07jsn24f1f6de4c18",
              "X-RapidAPI-Host": "google-map-places.p.rapidapi.com",
            },
          }
        );

        const result = await data.json();

        if (!result.result) throw new Error("No result found");

        const loc = result.result.geometry?.location;

        if (!loc) return;

        setPosition([loc.lat, loc.lng]);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    getLocation();
  }, [id]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await getDataAPI(
          `explore_posts/location/${id}?limit=${page * 10}`,
          auth?.token
        );

        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [id, auth?.token, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1].isIntersecting) {
          setPage((page) => page + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    observer.observe(pageEnd.current);
  }, []);

  const getZoomLevel = () => {
    const nameParts = name.split(",");

    switch (nameParts.length) {
      case 1:
        return 5; // Country
      case 2:
        return 10; // City
      default:
        return 13; // City
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      {position && (
        <MapContainer
          center={position}
          zoom={getZoomLevel()}
          scrollWheelZoom={false}
          zoomControl={false}
          dragging={false}
          attributionControl={false}
          touchZoom={false}
          doubleClickZoom={false}
          style={{ width: "100%", height: "250px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>{name}</Popup>
          </Marker>
        </MapContainer>
      )}
      <div>
        <div
        style={{
          paddingLeft:"130px",
          paddingRight:"130px",
          marginTop:"40px",
          marginBottom:"40px",
        }}
        >
          <h4 className="mb-0" style={{
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "30px",

          }}>{name}</h4>
          <span style={{
            fontSize: "14px",

          }}>Có {posts.length} bài viết</span>
        </div>

        <GalleryPost posts={posts} />
        {loading && <Loading />}
        <button
          className="btn w-100 mt-5"
          ref={pageEnd}
          style={{
            opacity: 0,
          }}
        >
          Tải thêm
        </button>
      </div>
    </div>
  );
};

export default ExploreLocations;
