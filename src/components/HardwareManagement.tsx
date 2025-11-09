
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

interface HardwareManagementProps {
    label: string;
    setNumber: number;
}

const HardwareManagement: React.FC<HardwareManagementProps> = ({ label, setNumber }) => {
    const capacity = 100;
    const [availability, setAvailability] = useState(100);
    const [allocated, setAllocated] = useState(0);
    const [quantity, setQuantity] = useState('');

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(e.target.value);
    };

    const handleCheckout = async () => {
        const qty = Number(quantity) || 0;
        if (qty > 0 && qty <= availability) {
            try {
                await axios.post(`${API_URL}/checkout_hardware`, {
                    setNumber,
                    qty,
                });
                setAvailability(prev => prev - qty);
                setAllocated(prev => prev + qty);
            } catch (err) {
                console.error(err);
                alert('Checkout failed');
            }
        }
        setQuantity('');
    };

    const handleCheckin = async () => {
        const qty = Number(quantity) || 0;
        if (qty > 0 && availability + qty <= capacity) {
            try {
                await axios.post(`${API_URL}/checkin_hardware`, {
                    setNumber,
                    qty,
                });
                setAvailability(prev => prev + qty);
                setAllocated(prev => Math.max(prev - qty, 0));
            } catch (err) {
                console.error(err);
                alert('Check-in failed');
            }
        }
        setQuantity('');
    };

    return (
        <div className="py-1 text-black">
            <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[160px] text-black">
                    <div className="font-semibold">{label}</div>
                    <div className="text-sm">Availability: {availability}/{capacity}</div>
                    <div className="text-sm">Allocated: {allocated}</div>
                </div>
                <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    placeholder="Enter Quantity"
                    min="0"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-44 border border-black rounded px-2 py-1 text-black"
                />
                <button
                    type="button"
                    onClick={handleCheckout}
                    className="px-4 py-1 border border-red-600 rounded bg-white text-red-600 font-semibold hover:bg-gray-100"
                >
                    Check-out
                </button>
                <button
                    type="button"
                    onClick={handleCheckin}
                    className="px-4 py-1 border border-green-600 rounded bg-white text-green-600 font-semibold hover:bg-gray-100"
                >
                    Check-in
                </button>
            </div>
        </div>
    );
};

export default HardwareManagement;
