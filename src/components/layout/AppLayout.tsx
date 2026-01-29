import { ReactNode } from "react";
import flugoLogo from "../../assets/logo.png";

type AppLayoutProps = {
    children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "row",
            }}
        >
            {/* Sidebar */}
            <aside
                style={{
                    width: "280px",
                    padding: "40px 28px 24px 44px",
                    backgroundColor: "#FFFFFF",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                    }}
                >
                    <img
                        src={flugoLogo}
                        alt="Flugo"
                        style={{
                            width: "36px",
                            height: "36px",
                            display: "block",
                        }}
                    />

                    <span
                        style={{
                            fontSize: "26px",
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing: "-0.02em",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Flugo
                    </span>
                </div>

                {/* Menu Item */}
                <div style={{ marginTop: "60px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            color: "#6B7280",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "12px",
                                backgroundColor: "#F3F4F6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* Ícone simples sem MUI */}
                            <span style={{ fontSize: "18px", color: "#9CA3AF" }}>👥</span>
                        </div>

                        <span style={{ fontSize: "18px", fontWeight: 500 }}>
                            Colaboradores
                        </span>

                        <div style={{ flex: 1 }} />

                        <span style={{ fontSize: "22px", color: "#9CA3AF" }}>›</span>
                    </div>
                </div>
            </aside>

            {/* Linha pontilhada */}
            <div
                style={{
                    width: "24px",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "12px",
                        borderLeft: "2px dotted #E5E7EB",
                    }}
                />
            </div>

            {/* Conteúdo */}
            <main style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                {/* Avatar topo direito */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        paddingTop: "32px",
                        paddingRight: "52px",
                    }}
                >
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "999px",
                            backgroundColor: "#E5E7EB",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "Inter, sans-serif",
                            color: "#9CA3AF",
                            fontWeight: 700,
                        }}
                    >
                        👤
                    </div>
                </div>

                {/* Área onde as páginas entram */}
                <div
                    style={{
                        paddingLeft: "88px",
                        paddingRight: "56px",
                        paddingTop: "24px",
                        paddingBottom: "56px",
                        maxWidth: "1120px",
                    }}
                >
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
