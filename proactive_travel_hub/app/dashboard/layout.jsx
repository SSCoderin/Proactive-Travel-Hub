import Provider from "../provider";
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
        <Provider>{children}</Provider>
    </div>
  );
}