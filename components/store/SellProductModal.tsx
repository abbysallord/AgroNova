"use client";
import React, { useState } from "react";
import { IconX, IconExclamationCircle, IconLoader } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";

interface SellProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onListProduct: (product: any) => void;
    sellerProfile: { name: string; upiId: string } | null;
}

export const SellProductModal = ({ isOpen, onClose, onListProduct, sellerProfile }: SellProductModalProps) => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        category: "Seeds",
        description: "",
        stock: "",
        unit: "kg",
        imageFile: null as File | null
    });
    const [listingError, setListingError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock) {
            setListingError("Please fill all required fields.");
            return;
        }

        setIsSubmitting(true);
        setListingError("");

        try {
            // Convert Image to Base64 for Persistence
            let imageUrl = "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=300&h=300&auto=format&fit=crop";

            if (newProduct.imageFile) {
                imageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(newProduct.imageFile!);
                });
            }

            const payload = {
                name: newProduct.name,
                price: newProduct.price,
                category: newProduct.category,
                image: imageUrl,
                seller: sellerProfile ? sellerProfile.name : "Verified Seller",
                sellerVpa: sellerProfile ? sellerProfile.upiId : "",
                sellerEmail: sellerProfile ? (sellerProfile as any).email : "", // Ensure email is passed
                description: newProduct.description,
                stock: newProduct.stock,
                unit: newProduct.unit,
                verifiedSeller: true
            };

            // Call API to persist
            const response = await fetch('/api/store/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to save product");

            const savedProduct = await response.json();

            // Pass the SAVED product back to parent to update local list immediately
            onListProduct(savedProduct);

            // Reset form
            setNewProduct({ name: "", price: "", category: "Seeds", description: "", stock: "", unit: "kg", imageFile: null });

        } catch (err) {
            console.error(err);
            setListingError("Failed to list product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-950 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">List New Product</h2>
                        <p className="text-sm text-neutral-500">Add detailed information to attract buyers.</p>
                    </div>
                    <button onClick={onClose}><IconX /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between">
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Product Name *</label>
                                <span className="text-[10px] text-neutral-400">{newProduct.name.length}/50</span>
                            </div>
                            <Input
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value.slice(0, 50) })}
                                placeholder="e.g. Fresh Potatoes"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Price (₹) *</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={newProduct.price}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (Number(val) < 0) return;
                                        setNewProduct({ ...newProduct, price: val })
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e") e.preventDefault();
                                    }}
                                    placeholder="00"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Per Unit</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm"
                                    value={newProduct.unit}
                                    onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                                >
                                    {["kg", "ton", "quintal", "piece", "packet", "liter", "acre"].map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Stock Available *</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={newProduct.stock}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (Number(val) < 0) return;
                                        setNewProduct({ ...newProduct, stock: val })
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e") e.preventDefault();
                                    }}
                                    placeholder="e.g. 50"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Category</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    {["Seeds", "Fertilizers", "Tools", "Equipment", "Harvest"].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="text-xs font-bold uppercase text-neutral-500 mb-1 block">Description *</label>
                                <span className="text-[10px] text-neutral-400">{newProduct.description.length}/300</span>
                            </div>
                            <textarea
                                className="w-full h-24 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Describe quality, origin, uses..."
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value.slice(0, 300) })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase text-neutral-500 block">Product Image *</label>
                        <FileUpload onChange={(files) => setNewProduct({ ...newProduct, imageFile: files[0] })} />
                        <p className="text-[10px] text-neutral-400 text-center">Supported: JPG, PNG (Max 5MB)</p>
                    </div>
                </div>

                {listingError && (
                    <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                        <IconExclamationCircle size={16} /> {listingError}
                    </div>
                )}

                <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3">
                    <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2 rounded-lg font-semibold hover:bg-neutral-100 disabled:opacity-50">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting && <IconLoader className="animate-spin" size={16} />}
                        Publish Listing
                    </button>
                </div>
            </div>
        </div>
    );
};
