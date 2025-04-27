import { Link } from "react-router-dom";
import useEventStore from "../store/useEventStore";
import { useEffect } from "react";

const CategoryFetcher = () => {
  const { getAllCategories, categories, isLoadingCategories } = useEventStore();

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 mt-6 text-center">All Categories</h2>
      {isLoadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <ul className="w-full mt-6 flex-wrap  flex items-center justify-center gap-6">
          {categories.map((cat, i) => (
            <Link to={`/search/${cat}`} className="btn btn-neutral" key={i}>{cat}</Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryFetcher;
