import { useEffect, useState } from "react";
import { endpoints } from "../services/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    endpoints
      .bookings()
      .then((response) => {
        setBookings(response.data.bookings || []);
      })
      .catch((error) => {
        console.error("Failed to load bookings:", error);
      });
  }, []);

  return (
    <section>
      <h1>Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div className="order" key={booking.id}>
            {booking.name} · {booking.booking_date}{" "}
            {booking.booking_time} · {booking.status}
          </div>
        ))
      )}
    </section>
  );
}