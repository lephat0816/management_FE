import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ApiService from "../service/ApiService";
import '../styles/Category.css'

interface CategoryData {
    title: string;
    isEditing: boolean;
    editingCategoryId: number;
}
const CategoryPage = () => {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryData>({
        title: "",
        isEditing: false,
        editingCategoryId: 0,
    });
    const [message, setMessage] = useState("");
    const getCategories = async () => {
        try {
            const res = await ApiService.getAllCategories();
            if (res.status === 200) {
                setCategories(res.categories);
            }
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "" + error
            )
        }
    };
    useEffect(() => {


        getCategories();
    }, []);

    const addCategory = async () => {
        if (!categoryData.title) {
            showMessage("Category name cannot be empty");
            return;
        }

        try {
            await ApiService.createCategory({ name: categoryData.title });
            getCategories();
            showMessage("Category successfully added");
            setCategoryData({ ...categoryData, title: "" });
            // window.location.reload();
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "..." + error
            )
        }
    }

    const editCategory = async () => {
        try {
            await ApiService.updateCategory(categoryData.editingCategoryId, { name: categoryData.title });

            setCategories(prev =>
                prev.map(cat =>
                    cat.id === categoryData.editingCategoryId
                        ? { ...cat, name: categoryData.title }
                        : cat
                )
            );
            showMessage("Category successfully updated");
            setCategoryData({ ...categoryData, isEditing: false, title: "" });
            // window.location.reload();
        } catch (error: any) {
            showMessage(
                error.response?.data?.message || "..." + error
            )
        }
    }

    const handleEditCategory = (category: any) => {
        setCategoryData({
            title: category.name,
            isEditing: true,
            editingCategoryId: category.id
        });

    }

    const handleDeleteCategory = async (categoryId: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await ApiService.deleteCategory(categoryId);
                showMessage("Category successfully deleted");
                getCategories();
            } catch (error: any) {
                showMessage(
                    error.response?.data?.message || "..." + error
                );
            }
        }
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 1000);
    }

    return (
        <Layout page={
            <div>
                {message && <div className="message">{message}</div>}
                <div className="category-page">
                    <div className="category-header">
                        <h1>Categories</h1>
                        <div className="add-cat">
                            <input
                                value={categoryData.title}
                                type="text"
                                placeholder="Category Title"
                                onChange={(e) => setCategoryData({ ...categoryData, title: e.target.value })}
                            />
                            {!categoryData.isEditing ? (
                                <button onClick={addCategory}>Add Category</button>
                            ) : (
                                <button onClick={editCategory}>Edit Category</button>
                            )}
                        </div>
                    </div>
                    {categories &&
                        <ul className="category-list">
                            {categories.map((category: any) => (
                                <li className="category-item" key={category.id}>
                                    <span>{category.name}</span>
                                    <div className="category-actions">
                                        <button onClick={() => handleEditCategory(category)}>Edit</button>
                                        <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
        }
        />
    )
}

export default CategoryPage;
