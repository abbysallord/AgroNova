"use client";
import React, { useState, useEffect } from "react";
import { IconShoppingCart, IconPlus, IconBuildingStore, IconCheck, IconLoader, IconTrash, IconShieldCheck, IconEdit } from "@tabler/icons-react";
import Image from "next/image";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { cn } from "@/lib/utils";

// Components
import { SellerVerifyModal } from "@/components/store/SellerVerifyModal";
import { SellProductModal } from "@/components/store/SellProductModal";
import { ProductDetailsModal } from "@/components/store/ProductDetailsModal";
import { CartDrawer } from "@/components/store/CartDrawer";
import { CheckoutModal } from "@/components/store/CheckoutModal";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    seller: string;
    sellerVpa?: string;
    sellerEmail?: string;
    description: string;
    stock: number;
    verifiedSeller: boolean;
    unit?: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface SellerProfile {
    name: string;
    upiId: string;
    email: string;
}

export default function AgriStorePage() {
    // --- Data State ---
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/store/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
                setFilteredProducts(data);
            }
        } catch (e) {
            console.error("Failed to fetch products", e);
        } finally {
            setLoading(false);
        }
    };

    const [cart, setCart] = useState<CartItem[]>([]);

    // --- UI State ---
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Filter Logic
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        filterData(e.target.value, selectedCategory);
    };
    const handleCategoryChange = (cat: string) => {
        setSelectedCategory(cat);
        filterData("", cat);
    };
    const filterData = (search: string, category: string) => {
        const lowerSearch = search.toLowerCase();
        setFilteredProducts(products.filter(p =>
            (category === "All" || p.category === category) &&
            (p.name.toLowerCase().includes(lowerSearch) || p.seller.toLowerCase().includes(lowerSearch))
        ));
    };

    // --- Seller Logic ---
    const [isSellerVerified, setIsSellerVerified] = useState(false);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
    const ADMIN_UPIS = ["admin@agronova", "dhanush@agronova"]; // Example admin list
    const isAdmin = sellerProfile && ADMIN_UPIS.includes(sellerProfile.upiId);

    // Seller Persistence
    useEffect(() => {
        const savedProfile = localStorage.getItem("seller_profile"); // Changed key
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setSellerProfile(parsed);
                setIsSellerVerified(true);
            } catch (e) {
                console.error("Failed to parse seller profile", e);
            }
        }
    }, []);

    const handleVerified = (data: { upiId: string; name: string; email: string }) => { // Added email to data type
        setIsSellerVerified(true);
        setSellerProfile(data);
        localStorage.setItem("seller_profile", JSON.stringify(data)); // Changed key
        alert("Welcome, " + data.name + "! You can now sell products."); // Added alert
    };

    const handleDeleteProduct = async (e: React.MouseEvent, productId: number) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/store/products?id=${productId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== productId));
                setFilteredProducts(prev => prev.filter(p => p.id !== productId));
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Error deleting product");
        }
    };


    // --- Sell Item Logic ---
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);

    const handleListProduct = (newProduct: Product) => {
        // The modal returns the Saved Product.
        // We just need to attach the correct Seller VPA to it locally for display immediately
        // (Though technically the API saved it, we might want to update the DB entry with proper seller name/VPA if we auth properly later)
        // For now, since we have no Auth on backend, we update the local object display properties
        // actually the modal already posted it.

        // But wait, the API 'POST' just saves whatever we sent. 
        // We should probably rely on re-fetching or optimistic update.
        // Let's attach the profile data to the object returned by DB for local consistency

        const productWithProfile = {
            ...newProduct,
            seller: sellerProfile ? sellerProfile.name : newProduct.seller,
            sellerVpa: sellerProfile ? sellerProfile.upiId : "seller@upi",
            sellerEmail: sellerProfile ? sellerProfile.email : "seller@agronova.com"
        };

        // Note: Ideally we want to UPDATE the backend with this profile info too, 
        // but for this MVP "Pre-Auth" flow, we just display it correctly locally.
        // A robust solution passes seller info to the API in the POST itself.
        // Let's assumes the Modal POST included what it could, and we override here for display.

        // Actually, to make it persistent properly, the Modal SHOULD have sent the right Seller Name/VPA.
        // But the Modal doesn't know the SellerProfile (it's in parent state).
        // REF: I need to pass sellerProfile TO the modal so it sends correct data to API.

        // RE-PLAN: In this render cycle, I can't easily change the Modal props without editing it again.
        // Hack: I will treat the received product as "semi-authentic" and just add it to list.
        // Better: I will update the Modal to accept `sellerProfile` prop in next step if needed, 
        // BUT actually, the user just wants persistence. 
        // Let's stick to: Modal adds product -> We add to list. 
        // The persistent JSON won't have the VPA unless I pass it. 
        // IMPORTANT: I will update `SellProductModal` usage below to include `sellerProfile` if I can, but I can't easily.
        // Actually, let's just refresh the list.

        setProducts([productWithProfile, ...products]);
        setFilteredProducts([productWithProfile, ...filteredProducts]);
        setIsSellModalOpen(false);
    };

    // --- Product Details & Checkout ---
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // --- Cart Logic ---
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            return [...prev, { ...product, quantity: 1 }];
        });
        // Removed auto-open: setIsCartOpen(true);
        alert("Item added to cart!");
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);

    const handleBuyNow = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        setDirectBuyItem({ ...product, quantity: 1 });
        setIsCheckoutOpen(true);
    };

    // Close checkout handler safely
    const handleCloseCheckout = () => {
        setIsCheckoutOpen(false);
        setDirectBuyItem(null); // Reset direct buy item
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 relative min-h-screen pb-20">
            {/* --- Header Section (Zen Search) --- */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tight">Agri Store <span className="text-green-600">Pro</span></h1>
                        <p className="text-neutral-500 font-medium mt-1">India's most trusted marketplace for farmers.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Seller Status */}
                        {isSellerVerified ? (
                            <div className="flex gap-2 flex-1 md:flex-none">
                                <button
                                    onClick={() => setIsSellModalOpen(true)}
                                    className="bg-neutral-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 flex-1 md:flex-none"
                                >
                                    <IconPlus stroke={3} size={18} /> Sell Product
                                </button>
                                <button
                                    onClick={() => setIsVerifyModalOpen(true)}
                                    className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-3 py-2.5 rounded-xl font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
                                    title="Edit Seller Profile"
                                >
                                    <IconEdit size={20} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsVerifyModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 flex-1 md:flex-none"
                            >
                                <IconBuildingStore size={20} /> Become a Seller
                            </button>
                        )}



                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-3 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-gray-50 transition-colors shrink-0"
                        >
                            <IconShoppingCart size={24} className="text-neutral-700 dark:text-neutral-200" />
                            {cart.length > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{cart.length}</span>}
                        </button>
                    </div>
                </div>

                {/* Zen Input */}
                <div className="w-full max-w-2xl mx-auto">
                    <PlaceholdersAndVanishInput
                        placeholders={["Search for 'Urea 50kg'...", "Find 'Tractor Rentals'...", "Buy 'Organic Seeds'...", "Search 'Pesticide Sprayers'..."]}
                        onChange={handleSearch}
                        onSubmit={(e) => e.preventDefault()}
                    />
                </div>
            </div>

            {/* --- Categories --- */}
            <div className="flex gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar justify-center">
                {["All", "Seeds", "Fertilizers", "Tools", "Equipment", "Harvest"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                            selectedCategory === cat
                                ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20"
                                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* --- Product Grid --- */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                    <IconLoader className="animate-spin mb-4" size={40} />
                    <p>Loading market...</p>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-neutral-200 rounded-3xl">
                    <div className="bg-neutral-100 p-4 rounded-full mb-4">
                        <IconBuildingStore size={40} className="text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-600">No Products Listed Yet</h3>
                    <p className="text-neutral-400 max-w-sm mt-2">Be the first to list your produce and start selling directly to buyers!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer" onClick={() => setSelectedProduct(product)}>
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {(isAdmin || (sellerProfile && product.sellerVpa === sellerProfile.upiId)) && (
                                    <button
                                        onClick={(e) => handleDeleteProduct(e, product.id)}
                                        className="absolute top-3 left-3 bg-red-500 text-white p-1.5 rounded-lg shadow-md hover:bg-red-600 z-10 transition-colors"
                                        title="Delete Product"
                                    >
                                        <IconTrash size={14} />
                                    </button>
                                )}
                                {product.verifiedSeller && (
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-blue-700 flex items-center gap-1 shadow-sm">
                                        <IconCheck size={12} stroke={4} /> VERIFIED
                                    </div>
                                )}
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-neutral-800 dark:text-white leading-tight group-hover:text-green-600 transition-colors">{product.name}</h3>
                                    <div className="text-right">
                                        <span className="block text-xl font-black text-neutral-900 dark:text-white">₹{product.price}</span>
                                        <span className="text-[10px] text-neutral-400 font-medium lowercase">/{product.unit || 'unit'}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-neutral-500 mb-4 font-medium flex items-center gap-1">
                                    <IconBuildingStore size={12} /> {product.seller}
                                </p>

                                <div className="mt-auto flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                        className="h-10 w-10 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                    >
                                        <IconShoppingCart size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => handleBuyNow(e, product)}
                                        className="flex-1 h-10 bg-green-600 text-white rounded-full font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center shadow-lg shadow-green-600/20"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Modals --- */}
            <SellerVerifyModal
                isOpen={isVerifyModalOpen}
                onClose={() => setIsVerifyModalOpen(false)}
                onVerified={handleVerified}
                initialData={sellerProfile || undefined}
            />

            <SellProductModal
                isOpen={isSellModalOpen}
                onClose={() => setIsSellModalOpen(false)}
                onListProduct={handleListProduct}
                sellerProfile={sellerProfile}
            />

            <ProductDetailsModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                onRemove={removeFromCart}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setDirectBuyItem(null);
                    setIsCheckoutOpen(true);
                }}
            />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={handleCloseCheckout}
                cart={cart}
                onClearCart={() => setCart([])}
                directBuyItem={directBuyItem}
            />

        </div>
    );
}
