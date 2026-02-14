"use client";
import React from "react";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export const AboutSection = () => {
    return (
        <section id="about" className="py-20 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                        Our Story & Values
                    </h2>
                    <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
                        We are bridging the gap between traditional farming and modern technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Mission */}
                    <CardContainer className="inter-var">
                        <CardBody className="bg-white/40 backdrop-blur-md relative group/card border-black/[0.1] w-full h-auto rounded-xl p-6 border  ">
                            <CardItem translateZ="100" className="w-full mt-4">
                                <Image
                                    src="/images/mission.jpg"
                                    height="1000"
                                    width="1000"
                                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                    alt="Mission"
                                />
                            </CardItem>
                            <CardItem
                                translateZ="50"
                                className="text-xl font-bold text-neutral-800 mt-4"
                            >
                                Our Mission
                            </CardItem>
                            <CardItem
                                as="p"
                                translateZ="60"
                                className="text-neutral-600 text-sm max-w-sm mt-2"
                            >
                                To empower every Indian farmer with the intelligence and tools they need to maximize yield and sustainable growth.
                            </CardItem>
                        </CardBody>
                    </CardContainer>

                    {/* Card 2: Vision */}
                    <CardContainer className="inter-var">
                        <CardBody className="bg-white/40 backdrop-blur-md relative group/card border-black/[0.1] w-full h-auto rounded-xl p-6 border  ">
                            <CardItem translateZ="100" className="w-full mt-4">
                                <Image
                                    src="/images/vision.jpg"
                                    height="1000"
                                    width="1000"
                                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                    alt="Vision"
                                />
                            </CardItem>
                            <CardItem
                                translateZ="50"
                                className="text-xl font-bold text-neutral-800 mt-4"
                            >
                                Our Vision
                            </CardItem>
                            <CardItem
                                as="p"
                                translateZ="60"
                                className="text-neutral-600 text-sm max-w-sm mt-2"
                            >
                                A future where technology and agriculture work in perfect harmony, ensuring food security for generations to come.
                            </CardItem>
                        </CardBody>
                    </CardContainer>

                    {/* Card 3: Community */}
                    <CardContainer className="inter-var">
                        <CardBody className="bg-white/40 backdrop-blur-md relative group/card border-black/[0.1] w-full h-auto rounded-xl p-6 border  ">
                            <CardItem translateZ="100" className="w-full mt-4">
                                <Image
                                    src="/images/community.jpg"
                                    height="1000"
                                    width="1000"
                                    className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                                    alt="Community"
                                />
                            </CardItem>
                            <CardItem
                                translateZ="50"
                                className="text-xl font-bold text-neutral-800 mt-4"
                            >
                                The Community
                            </CardItem>
                            <CardItem
                                as="p"
                                translateZ="60"
                                className="text-neutral-600 text-sm max-w-sm mt-2"
                            >
                                Connecting over 10,000+ farmers to share knowledge, sell produce, and grow together as one powerful family.
                            </CardItem>

                        </CardBody>
                    </CardContainer>
                </div>
            </div>
        </section>
    );
};
