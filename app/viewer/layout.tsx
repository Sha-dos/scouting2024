export default function ViewerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-w-[100%]">
            <div className="inline-block min-w-[100%] text-center justify-center">
                {children}
            </div>
        </section>
    );
}
