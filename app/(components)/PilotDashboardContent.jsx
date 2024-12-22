'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const PilotDashboardContent = () => {
  
  const { data: session } = useSession();
  const [flightData, setFlightData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Airborne');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [airborneFlights, setAirborneFlights] = useState([]);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const [pastFlights, setPastFlights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;

      try {
        const response = await fetch('/api/pilotData');
        const data = await response.json();
        const flights = Array.isArray(data) ? data : [];
        setFlightData(flights);
        setFilteredData(flights);
        categorizeFlights(flights);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flight data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    const results = flightData.filter(flight =>
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [searchTerm, flightData]);

  // Categorize flights into Airborne, Upcoming, and Past
  const categorizeFlights = (flights) => {
    const now = new Date(); // Get the current date and time

    const airborne = [];
    const upcoming = [];
    const past = [];

    flights.forEach(flight => {
      const departureTime = new Date(flight.departureTime); // Parse departure time
      const arrivalTime = new Date(flight.arrivalTime); // Parse arrival time

      // Check if the flight is airborne
      if (now >= departureTime && now <= arrivalTime) {
        airborne.push(flight);
      }
      // Check if the flight is upcoming
      else if (now < departureTime) {
        upcoming.push(flight);
      }
      // Check if the flight is past
      else if (now > arrivalTime) {
        past.push(flight);
      }
    });

    // Update state with categorized flights
    setAirborneFlights(airborne);
    setUpcomingFlights(upcoming);
    setPastFlights(past);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> {session?.user?.role} Dashboard</h1>
      <div className="tabs mb-4">
        <button
          onClick={() => handleTabClick('Airborne')}
          className={`px-4 py-2 ${activeTab === 'Airborne' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Airborne
        </button>
        <button
          onClick={() => handleTabClick('Upcoming')}
          className={`px-4 py-2 ${activeTab === 'Upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => handleTabClick('Past')}
          className={`px-4 py-2 ${activeTab === 'Past' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Past
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Flight Number"
          value={searchTerm}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-lg w-full"
        />
      </div>
      {activeTab === 'Airborne' && (
        <div>
          <h1 className="text-xl font-semibold mb-4">Airborne Flights</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData
              .filter(flight => airborneFlights.includes(flight))
              .map(flight => (
                <Link href={`/flight/${flight._id}`} key={flight._id}>
                  <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100">
                    <h2 className="text-lg font-bold mb-2">Flight Number: {flight.flightNumber}</h2>
                    <p><strong>Airline:</strong> {flight.airlineName}</p>
                    <p><strong>Aircraft Type:</strong> {flight.aircraftType}</p>
                    <p><strong>Origin Airport:</strong> {flight.originAirport}</p>
                    <p><strong>Destination Airport:</strong> {flight.destinationAirport}</p>
                    <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                    <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
      {activeTab === 'Upcoming' && (
        <div>
          <h1 className="text-xl font-semibold mb-4">Upcoming Flights</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData
              .filter(flight => upcomingFlights.includes(flight))
              .map(flight => (
                <Link href={`/flight/${flight._id}`} key={flight._id}>
                  <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100">
                    <h2 className="text-lg font-bold mb-2">Flight Number: {flight.flightNumber}</h2>
                    <p><strong>Airline:</strong> {flight.airlineName}</p>
                    <p><strong>Aircraft Type:</strong> {flight.aircraftType}</p>
                    <p><strong>Origin Airport:</strong> {flight.originAirport}</p>
                    <p><strong>Destination Airport:</strong> {flight.destinationAirport}</p>
                    <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                    <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
      {activeTab === 'Past' && (
        <div>
          <h1 className="text-xl font-semibold mb-4">Past Flights</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData
              .filter(flight => pastFlights.includes(flight))
              .map(flight => (
                <Link href={`/flight/${flight._id}`} key={flight._id}>
                  <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100">
                    <h2 className="text-lg font-bold mb-2">Flight Number: {flight.flightNumber}</h2>
                    <p><strong>Airline:</strong> {flight.airlineName}</p>
                    <p><strong>Aircraft Type:</strong> {flight.aircraftType}</p>
                    <p><strong>Origin Airport:</strong> {flight.originAirport}</p>
                    <p><strong>Destination Airport:</strong> {flight.destinationAirport}</p>
                    <p><strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}</p>
                    <p><strong>Arrival Time:</strong> {new Date(flight.arrivalTime).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default PilotDashboardContent;
