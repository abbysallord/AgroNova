"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IconShoppingCart } from "@tabler/icons-react";

const featuredProducts = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        price: "₹40/kg",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
        id: 2,
        name: "Organic Potatoes",
        price: "₹30/kg",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
        id: 3,
        name: "Green Spinach",
        price: "₹20/bundle",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
];

export const MarketplaceWidget = () => {
    return (
        <div className="flex flex-col h-full justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Featured Produce</span>
                    <IconShoppingCart className="w-4 h-4 text-green-500" />
                </div>

                <div className="space-y-3">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{product.name}</span>
                                <span className="text-xs text-green-600 dark:text-green-400 font-bold">{product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Link href="/dashboard/store" className="relative z-10 mt-4 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg text-center transition-colors">
                Shop Fresh
            </Link>
        </div>
    );
};
