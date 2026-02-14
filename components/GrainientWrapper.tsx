"use client";
import React from "react";
import dynamic from "next/dynamic";

const Grainient = dynamic(() => import("./Grainient"), { ssr: false });

export default function GrainientWrapper(props: any) {
    return <Grainient {...props} />;
}
