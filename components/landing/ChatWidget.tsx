"use client";
import React, { useState } from "react";

export const ChatWidget = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div
            style={{
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",
                borderRadius: "30px",
                width: "360px",
                position: "fixed",
                right: "1.5rem",
                bottom: "4rem",
                zIndex: 9999, // Added z-index to ensure it sits on top
            }}
        >
            <div
                id="ig-chat-container"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "0.375rem",
                    fontFamily: "sans-serif",
                    paddingBottom: "1rem",
                    visibility: isVisible ? "visible" : "hidden",
                    border: "1px solid #E3E5F5",
                    transition:
                        "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0%)" : "translateY(100%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexDirection: "row",
                        width: "100%", // changed from -webkit-fill-available
                        height: "auto",
                        padding: "1rem",
                        gap: "1.25rem",
                        position: "relative",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "3rem",
                            height: "3rem",
                            backgroundColor: "#f8fafc",
                            borderRadius: "9999px",
                            position: "relative",
                            padding: "0.125rem",
                        }}
                    >
                        <img
                            src="https://cdn.jotfor.ms/assets/agent-avatars/avatar_icon_206.png"
                            alt="agent-avatar"
                            style={{
                                width: "2.75rem",
                                height: "2.75rem",
                                backgroundColor: "#f8fafc",
                                borderRadius: "9999px",
                            }}
                        />
                        <div
                            style={{
                                width: "1rem",
                                height: "1rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#ffffff",
                                borderRadius: "9999px",
                                position: "absolute",
                                bottom: "0px",
                                right: "-0.125rem",
                            }}
                        >
                            <div
                                style={{
                                    width: "0.75rem",
                                    height: "0.75rem",
                                    backgroundColor: "#22c55e",
                                    borderRadius: "9999px",
                                }}
                            ></div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            flexGrow: 1,
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 700,
                                color: "#334155",
                                margin: "0.25rem",
                            }}
                        >
                            15558032385
                        </p>
                        <p
                            style={{
                                fontWeight: 500,
                                color: "#334155",
                                margin: "0.25rem",
                            }}
                        >
                            Online
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        style={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                            display: "inline-flex",
                            flexShrink: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            fontWeight: 500,
                            transitionDuration: "300ms",
                            outlineWidth: "2px",
                            outlineColor: "transparent",
                            outlineOffset: "0px",
                            height: "2rem",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                            borderWidth: "0px",
                            cursor: "pointer",
                            backgroundColor: "transparent",
                            color: "#334155",
                        }}
                    >
                        <span
                            style={{
                                paddingLeft: "0.25rem",
                                paddingRight: "0.25rem",
                                fontSize: "0.875rem",
                                lineHeight: "1.25rem",
                            }}
                        >
                            x
                        </span>
                    </button>
                </div>
                <div
                    style={{
                        width: "100%",
                        height: "1px",
                        paddingBottom: "0.5rem",
                        borderTop: "1px solid #E3E5F5",
                    }}
                ></div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        flexDirection: "row",
                        width: "100%", // changed from -webkit-fill-available
                        height: "auto",
                        padding: "1rem",
                        gap: "1.25rem",
                    }}
                >
                    <img
                        src="https://cdn.jotfor.ms/assets/agent-avatars/avatar_icon_206.png"
                        alt="agent-avatar"
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            backgroundColor: "#f8fafc",
                            borderRadius: "9999px",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            flexDirection: "column",
                            flexGrow: 1,
                            borderRadius: "0.375rem",
                            backgroundColor: "#fafafa",
                            paddingLeft: "1rem",
                        }}
                    >
                        <p
                            style={{
                                color: "#334155",
                                margin: "0.25rem",
                            }}
                        >
                            Hi there! 🌟
                        </p>
                        <p
                            style={{
                                color: "#334155",
                                margin: "0.25rem",
                            }}
                        >
                            How can I help you?
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    style={{
                        borderRadius: "9999px",
                        display: "inline-flex",
                        flexShrink: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 500,
                        transitionDuration: "300ms",
                        outlineWidth: "2px",
                        outlineColor: "transparent",
                        outlineOffset: "0px",
                        height: "3rem",
                        padding: "0 0.75rem",
                        borderWidth: "0px",
                        cursor: "pointer",
                        color: "#ffffff",
                        backgroundColor: "#25D366",
                    }}
                    onClick={() => (window.location.href = "https://wa.me/15558032385")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        name="icon_whatsapp"
                        width="24"
                        className="w-10 h-10 shrink-0 radius p-2 color-white mr-3 whatsapp-gradient"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 3a8.5 8.5 0 0 0-8.5 8.5c0 1.835.58 3.532 1.568 4.92.227.319.283.69.304.926.023.27.012.562-.014.844A15.032 15.032 0 0 1 5.055 20L5 20.24l.312-.127a17.83 17.83 0 0 1 1.785-.623 5.67 5.67 0 0 1 .83-.173c.228-.027.595-.05.942.088A8.475 8.475 0 0 0 12 20a8.5 8.5 0 0 0 0-17ZM2.543 21.709l.003-.01.01-.033a22.762 22.762 0 0 0 .173-.606c.11-.4.25-.936.373-1.492.124-.562.225-1.116.264-1.557a2.994 2.994 0 0 0 .01-.52A10.456 10.456 0 0 1 1.5 11.5C1.5 5.701 6.201 1 12 1s10.5 4.701 10.5 10.5S17.799 22 12 22a10.47 10.47 0 0 1-3.782-.702c-.015 0-.035.003-.059.005-.123.015-.3.051-.53.115a15.92 15.92 0 0 0-1.574.552 37.308 37.308 0 0 0-1.95.85l-.129.06-.033.016-.01.005a1 1 0 0 1-1.39-1.192Zm5.715-.412h-.002.002Z"
                            clipRule="evenodd"
                        ></path>
                        <path d="M16.885 13.823c-.042-.02-1.616-.795-1.895-.896a1.089 1.089 0 0 0-.367-.081c-.212 0-.391.106-.53.314-.157.233-.633.79-.78.956-.02.022-.046.048-.062.048-.014 0-.257-.1-.33-.132-1.69-.733-2.971-2.497-3.147-2.795-.025-.042-.026-.062-.026-.062a.492.492 0 0 1 .092-.109c.086-.085.179-.196.269-.305.042-.05.085-.102.127-.15.13-.152.188-.27.255-.406l.036-.071a.732.732 0 0 0-.022-.691c-.037-.075-.702-1.679-.772-1.847C9.563 7.189 9.338 7 9.026 7c-.029 0 0 0-.121.005-.148.006-.953.112-1.309.337-.377.238-1.016.996-1.016 2.33 0 1.201.762 2.335 1.09 2.766l.044.065c1.253 1.83 2.814 3.185 4.398 3.818 1.524.609 2.246.679 2.656.679.173 0 .31-.014.432-.026l.078-.007c.526-.047 1.684-.646 1.947-1.378.207-.576.262-1.205.124-1.434-.095-.155-.258-.233-.464-.332Z"></path>
                    </svg>
                    <span
                        style={{
                            padding: "0 0.75rem",
                            fontSize: "1.125rem",
                            lineHeight: "1.75rem",
                        }}
                    >
                        Message on Whatsapp
                    </span>
                </button>
            </div>
            <button
                id="ig-chat-button"
                type="button"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    borderRadius: "9999px",
                    display: "inline-flex",
                    flexShrink: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 500,
                    transitionDuration: "300ms",
                    outlineWidth: "2px",
                    outlineColor: "transparent",
                    outlineOffset: "0px",
                    height: "4rem",
                    width: "4rem",
                    cursor: "pointer",
                    backgroundColor: "#25D366",
                    color: "#ffffff",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    visibility: !isVisible ? "visible" : "hidden",
                    opacity: !isVisible ? 1 : 0,
                    transform: !isVisible ? `translateY(0%) scale(${isHovered ? 1.1 : 1})` : "translateY(100%)",
                    transition:
                        "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s",
                    zIndex: 10000,
                }}
                onClick={toggleVisibility}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    name="icon_whatsapp"
                    width="24"
                    className="w-10 h-10 shrink-0 p-2 fill-current"
                >
                    <path
                        fillRule="evenodd"
                        d="M12 3a8.5 8.5 0 0 0-8.5 8.5c0 1.835.58 3.532 1.568 4.92.227.319.283.69.304.926.023.27.012.562-.014.844A15.032 15.032 0 0 1 5.055 20L5 20.24l.312-.127a17.83 17.83 0 0 1 1.785-.623 5.67 5.67 0 0 1 .83-.173c.228-.027.595-.05.942.088A8.475 8.475 0 0 0 12 20a8.5 8.5 0 0 0 0-17ZM2.543 21.709l.003-.01.01-.033a22.762 22.762 0 0 0 .173-.606c.11-.4.25-.936.373-1.492.124-.562.225-1.116.264-1.557a2.994 2.994 0 0 0 .01-.52A10.456 10.456 0 0 1 1.5 11.5C1.5 5.701 6.201 1 12 1s10.5 4.701 10.5 10.5S17.799 22 12 22a10.47 10.47 0 0 1-3.782-.702c-.015 0-.035.003-.059.005-.123.015-.3.051-.53.115a15.92 15.92 0 0 0-1.574.552 37.308 37.308 0 0 0-1.95.85l-.129.06-.033.016-.01.005a1 1 0 0 1-1.39-1.192Zm5.715-.412h-.002.002Z"
                        clipRule="evenodd"
                    ></path>
                    <path d="M16.885 13.823c-.042-.02-1.616-.795-1.895-.896a1.089 1.089 0 0 0-.367-.081c-.212 0-.391.106-.53.314-.157.233-.633.79-.78.956-.02.022-.046.048-.062.048-.014 0-.257-.1-.33-.132-1.69-.733-2.971-2.497-3.147-2.795-.025-.042-.026-.062-.026-.062a.492.492 0 0 1 .092-.109c.086-.085.179-.196.269-.305.042-.05.085-.102.127-.15.13-.152.188-.27.255-.406l.036-.071a.732.732 0 0 0-.022-.691c-.037-.075-.702-1.679-.772-1.847C9.563 7.189 9.338 7 9.026 7c-.029 0 0 0-.121.005-.148.006-.953.112-1.309.337-.377.238-1.016.996-1.016 2.33 0 1.201.762 2.335 1.09 2.766l.044.065c1.253 1.83 2.814 3.185 4.398 3.818 1.524.609 2.246.679 2.656.679.173 0 .31-.014.432-.026l.078-.007c.526-.047 1.684-.646 1.947-1.378.207-.576.262-1.205.124-1.434-.095-.155-.258-.233-.464-.332Z"></path>
                </svg>
            </button>
        </div>
    );
};
