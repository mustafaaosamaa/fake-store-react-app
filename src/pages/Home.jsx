import { useMemo, useState } from "react";

import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

import { useProducts } from "../hooks/useProducts";

function Home() {
  const { products, loading, error } =
    useProducts();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const categories = useMemo(
    () => [
      ...new Set(
        products.map(
          (product) => product.category
        )
      )
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === ""
          ? true
          : product.category ===
            selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    searchTerm,
    selectedCategory
  ]);

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <ErrorMessage message={error} />
    );

  return (
    <>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={
          selectedCategory
        }
        onChange={setSelectedCategory}
      />

      {filteredProducts.length === 0 ? (
        <h2>No Results Found</h2>
      ) : (
        <div className="grid">
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      )}
    </>
  );
}

export default Home;