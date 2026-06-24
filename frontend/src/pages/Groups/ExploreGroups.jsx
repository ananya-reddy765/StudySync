import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Plus,
} from "lucide-react";

import GroupCard from "../../components/groups/GroupCard";
import CreateGroupModal from "../../components/groups/CreateGroupModal";

import {
  getGroups,
  joinGroup,
  createGroup,
} from "../../services/groupService";

const ExploreGroups = () => {

  const [groups, setGroups] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [openModal, setOpenModal] =
    useState(false);

  // ✅ FIX: track loading and error states
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await getGroups();
      setGroups(res.groups);
    } catch (error) {
      console.log(error);
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await joinGroup(id);
      alert("Joined Successfully");
      // ✅ FIX: refresh groups after joining so member count updates
      fetchGroups();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to join group"
      );
    }
  };

  const handleCreate = async (data) => {
    try {
      await createGroup(data);
      setOpenModal(false);
      fetchGroups();
    } catch (error) {
      // ✅ FIX: throw error so modal can catch and display it
      throw error;
    }
  };

  const filteredGroups = groups.filter(
    (group) =>
      group.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Explore Groups
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-violet-600 text-white px-5 py-3 rounded-xl flex gap-2 items-center hover:bg-violet-700"
        >
          <Plus size={18} />
          Create Group
        </button>

      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="relative mb-8">

        <Search
          size={18}
          className="absolute top-4 left-4 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-400"
        />

      </div>

      {/* GROUPS GRID */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          Loading groups...
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-400">
          No groups found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onJoin={handleJoin}
            />
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {openModal && (
        <CreateGroupModal
          onClose={() => setOpenModal(false)}
          onCreate={handleCreate}
        />
      )}

    </div>
  );
};

export default ExploreGroups;