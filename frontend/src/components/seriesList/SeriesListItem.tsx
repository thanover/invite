import { useState } from "react";
import { SeriesType } from "../../types/series";
import InviteList from "../inviteList/InviteList";

export type SeriesListItemProps = {
  series: SeriesType;
};

const SeriesListItem: React.FC<SeriesListItemProps> = ({ series }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ExpandButton = () => {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transform transition-transform duration-300 ${
          isOpen ? "rotate-90" : ""
        } p-2`}
      >
        <span className="">{">"}</span>
      </button>
    );
  };

  return (
    <div className="border-b border-[#7AA2F7] flex flex-col">
      <div className="flex flex-row items-center justify-center">
        <div className="w-4 flex items-center justify-center">
          {series.invites.length > 0 && <ExpandButton />}
        </div>
        <div className="p-6 flex flex-col">
          <div>{series.title}</div>
          <div className="text-[var(--color-turquoise)] text-xs">
            {series.description}
          </div>
        </div>
        <div className="ml-auto flex items-center justify-center p-4">
          {series.invites.length == 0 ? "no" : series.invites.length} invites
        </div>
      </div>

      {isOpen && (
        <div>
          <div>
            <InviteList invites={series.invites} />
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Create Invite
            </button>
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Create New Invite</h2>
                <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Add logic to create a new invite
                  console.log("New invite created");
                  setShowModal(false);
                }}
                >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                  Invite Name
                  </label>
                  <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                  >
                  Cancel
                  </button>
                  <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                  Create
                  </button>
                </div>
                </form>
              </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesListItem;
