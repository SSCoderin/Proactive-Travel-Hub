
import Provider from "../provider";
export default function BookingLayout({ children }) {
  return <div className="min-h-screen">
        <Provider>{children}</Provider>
  </div>;
}   