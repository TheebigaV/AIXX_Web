import React from "react";

type BannerRow = {
  id: number;
  title1: string;
  title2: string;
  subtitle: string;
  image_url?: string | null;
};

type Props = {
  banners: BannerRow[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void; // 👈 new prop for edit
};

const BasicTableOne: React.FC<Props> = ({ banners, onDelete, onEdit }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-[1102px] w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-[15px] font-medium text-gray-500 border-b">Title 1</th>
              <th className="px-6 py-3 text-left text-[15px] font-medium text-gray-500 border-b">Title 2</th>
              <th className="px-6 py-3 text-left text-[15px] font-medium text-gray-500 border-b">Subtitle</th>
              <th className="px-6 py-3 text-left text-[15px] font-medium text-gray-500 border-b">Image</th>
              <th className="px-6 py-3 text-left text-[15px] font-medium text-gray-500 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{banner.title1}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{banner.title2}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={banner.subtitle}>
                  {banner.subtitle}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {banner.image_url ? (
                    <img src={banner.image_url} alt="Banner" className="h-12 w-auto rounded border" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium flex gap-4">
                  <button
                    onClick={() => onEdit(banner.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(banner.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicTableOne;
