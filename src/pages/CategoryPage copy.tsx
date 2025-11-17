import Box from "@mui/material/Box";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import '../styles/Category.css'
import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid";
import CategoryCard from "../components/CategoryCard";
import Pagination from "../components/Pagination";
import { useState } from "react";


export interface CategoryData {
    id?: number;
    name: string;
    description: string;
    imageUrl: string;
    status: string;
    isEditing: boolean;
    editingCategoryId: number;
}

const CategoryPage2 = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 2;

    const { isLoading, error, data } = useQuery({
        queryKey: ['categories', currentPage],
        queryFn: async () => {
            const resCategories = await ApiService.getAllCategories();
            // return resCategories.categories;
            // setTotalPages(Math.ceil(resCategories.categories.length / itemsPerPage));
            return {
                categories: resCategories.categories.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                ),
                totalPages: Math.ceil(resCategories.categories.length / itemsPerPage)
            };
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories</div>;

    return (
        <Layout
            page={
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {data?.categories.map((category: CategoryData) => (
                            <Grid key={category.id} size={{ xs: 2, sm: 4, md: 4 }}>
                                <CategoryCard
                                    name={category.name}
                                    description={category.description}
                                    imageUrl={category.imageUrl}
                                    status={category.status}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </Box>

            }
        />
    );
};

export default CategoryPage2;
