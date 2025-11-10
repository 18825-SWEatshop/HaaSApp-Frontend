
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

interface HardwareManagementProps {
    setNumber: number;
    projectId: string;
    initialAllocation?: number;
}

const HardwareManagement: React.FC<HardwareManagementProps> = ({ setNumber, projectId, initialAllocation = 0 }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const [capacity, setCapacity] = useState(0);
    const [availability, setAvailability] = useState(0);
    const [allocation, setAllocation] = useState(initialAllocation);
    const [quantity, setQuantity] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const label = `HWSet${setNumber}`;

    useEffect(() => {
        setAllocation(initialAllocation);
    }, [initialAllocation]);

    useEffect(() => {
        let isCancelled = false;
        async function loadHardwareStatus() {
            if (!token) {
                setError('Please log in first.');
                setIsLoading(false);
                return;
            }
            if (!API_URL) {
                setError('Hardware service is not configured.');
                setIsLoading(false);
                return;
            }
            if (!projectId) {
                setError('Unable to locate project information.');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const [capacityRes, availabilityRes] = await Promise.all([
                    axios.get(`${API_URL}/capacity/${setNumber}`, { headers }),
                    axios.get(`${API_URL}/availability/${setNumber}`, { headers }),
                ]);
                if (isCancelled) return;
                const capacityValue = Number(capacityRes.data?.capacity ?? 0);
                const availabilityValue = Number(availabilityRes.data?.availability ?? 0);
                setCapacity(capacityValue);
                setAvailability(availabilityValue);
            } catch (err) {
                if (!isCancelled) {
                    console.error(err);
                    setError('Failed to load hardware status.');
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }
        loadHardwareStatus();
        return () => {
            isCancelled = true;
        };
    }, [projectId, setNumber, token, API_URL]);

    

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(e.target.value);
    };

    const handleCheckout = async () => {
        const qty = Number(quantity) || 0;
        if (!token) {
            alert('Please log in first.');
            setQuantity('');
            return;
        }
        if (!API_URL) {
            alert('Hardware service is not configured.');
            setQuantity('');
            return;
        }
        if (!projectId) {
            alert('Unable to locate project information.');
            setQuantity('');
            return;
        }
        if (qty > 0 && qty <= availability) {
            try {
                const { data } = await axios.post(
                    `${API_URL}/checkout`,
                    {
                        setNumber,
                        quantity: qty,
                        projectId,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const resource = data?.resource;
                if (resource) {
                    const updatedAvailability = Number(resource.availability ?? availability);
                    const updatedCapacity = Number(resource.capacity ?? capacity);
                    setAvailability(updatedAvailability);
                    setCapacity(updatedCapacity);
                    setAllocation(prev => prev + qty);
                } else {
                    setAvailability(prev => prev - qty);
                    setAllocation(prev => prev + qty);
                }
            } catch (err) {
                console.error(err);
                alert('Checkout failed');
            }
        }
        setQuantity('');
    };

    const handleCheckin = async () => {
        const qty = Number(quantity) || 0;
        if (!token) {
            alert('Please log in first.');
            setQuantity('');
            return;
        }
        if (!API_URL) {
            alert('Hardware service is not configured.');
            setQuantity('');
            return;
        }
        if (!projectId) {
            alert('Unable to locate project information.');
            setQuantity('');
            return;
        }
        if (qty > 0 && availability + qty <= capacity) {
            try {
                const { data } = await axios.post(
                    `${API_URL}/checkin`,
                    {
                        setNumber,
                        quantity: qty,
                        projectId,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const resource = data?.resource;
                if (resource) {
                    const updatedAvailability = Number(resource.availability ?? availability);
                    const updatedCapacity = Number(resource.capacity ?? capacity);
                    setAvailability(updatedAvailability);
                    setCapacity(updatedCapacity);
                    setAllocation(prev => Math.max(prev - qty, 0));
                } else {
                    setAvailability(prev => prev + qty);
                    setAllocation(prev => Math.max(prev - qty, 0));
                }
            } catch (err) {
                console.error(err);
                alert('Check-in failed');
            }
        }
        setQuantity('');
    };

    return (
        <div className="py-1 text-black">
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-[160px] text-black">
                    <div className="font-semibold">{label}</div>
                    <div className="text-sm">
                        Availability: {isLoading ? '...' : `${availability}/${capacity}`}
                    </div>
                    <div className="text-sm">Allocated: {isLoading ? '...' : allocation}</div>
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
                    disabled={isLoading}
                >
                    Check-out
                </button>
                <button
                    type="button"
                    onClick={handleCheckin}
                    className="px-4 py-1 border border-green-600 rounded bg-white text-green-600 font-semibold hover:bg-gray-100"
                    disabled={isLoading}
                >
                    Check-in
                </button>
            </div>
        </div>
    );
};

export default HardwareManagement;
