import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { resourceTypes } from '../../constants';
import AddResourceModal from '../AddResourceModal/AddResourceModal';

const ResourceManager = ({
  resources,
  isAddResourceModalOpen,
  setIsAddResourceModalOpen,
  newResource,
  setNewResource,
  handleAddResource,
  handleDeleteResource,
  getIconForType,
  uploading
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Resources</h2>
        <button
          onClick={() => setIsAddResourceModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => window.open(resource.url, "_blank")}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getIconForType(resource.type)}
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 size={16} className="text-gray-500" />
                </button>
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteResource(resource.id)}}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddResourceModalOpen && (
        <AddResourceModal
          newResource={newResource}
          setNewResource={setNewResource}
          handleAddResource={handleAddResource}
          setIsAddResourceModalOpen={setIsAddResourceModalOpen}
          resourceTypes={resourceTypes}
          uploading = {uploading}
        />
      )}
    </div>
  );
};

export default ResourceManager