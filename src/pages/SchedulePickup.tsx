
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Recycle } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

const SchedulePickup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    streetAddress: "",
    apartmentNumber: "",
    state: "",
    pinCode: "",
    pickupDate: "",
    pickupTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F2FCE2]">
      <Navigation />
      <div className="max-w-3xl mx-auto pt-24 px-6 pb-16">
        <h1 className="text-4xl font-bold mb-12">Schedule Your E-Waste Pickup</h1>
        
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">1</span>
              Item Selection
            </h2>
            <div className="relative mb-4">
              <Input 
                placeholder="Search Items"
                className="pl-10 bg-[#F2FCE2] border-0"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start"
                >
                  <Recycle className="w-4 h-4 mr-2" />
                  Refrigerator
                </Button>
              ))}
            </div>
            <button className="text-primary text-sm mt-4">view more</button>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">2</span>
              Pickup Address
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                placeholder="Second Name"
                name="secondName"
                value={formData.secondName}
                onChange={handleChange}
              />
              <Input
                placeholder="Street Address"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="md:col-span-2"
              />
              <Input
                placeholder="Apartment Number"
                name="apartmentNumber"
                value={formData.apartmentNumber}
                onChange={handleChange}
              />
              <Input
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                placeholder="PIN Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                className="md:col-span-2"
              />
            </form>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">3</span>
              Date & Time Slots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Pickup Date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
              />
              <Input
                type="time"
                placeholder="Pickup Time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">4</span>
              Item Image Upload
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="max-w-[200px] mx-auto">
                <img src="/placeholder.svg" alt="Upload" className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">Image less than 10 MB</p>
                <Button variant="outline" size="sm">Browse</Button>
              </div>
            </div>
          </section>

          <Button type="submit" className="w-full" size="lg">
            Submit your Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePickup;
