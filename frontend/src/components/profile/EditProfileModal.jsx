import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const EditProfileModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    college: user?.college || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // TODO: replace with authApi call once a backend
    // profile-update endpoint exists, e.g.
    // const { data } = await authApi.updateProfile(form);
    // updateUser(data);
    updateUser(form);

    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/60
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          bg-slate-900
          border border-slate-800
          rounded-2xl
          w-full max-w-md
          p-6
        "
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Edit Profile
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="
                w-full
                bg-slate-950
                border border-slate-800
                rounded-xl
                px-4 py-2
                text-white
                outline-none
                focus:border-purple-500
              "
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              College / Institution
            </label>
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              className="
                w-full
                bg-slate-950
                border border-slate-800
                rounded-xl
                px-4 py-2
                text-white
                outline-none
                focus:border-purple-500
              "
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="
                w-full
                bg-slate-950
                border border-slate-800
                rounded-xl
                px-4 py-2
                text-white
                outline-none
                focus:border-purple-500
                resize-none
              "
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2
                rounded-xl
                text-gray-300
                hover:bg-slate-800
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-4 py-2
                rounded-xl
                bg-purple-600
                hover:bg-purple-500
                text-white
                font-medium
              "
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;