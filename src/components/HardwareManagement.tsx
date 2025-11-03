
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

interface HardwareManagementProps {
    label: string;
    projectId?: string;
}

const HardwareManagement: React.FC<HardwareManagementProps> = ({ label, projectId = 'P1' }) => {
    const capacity = 100;
    const [availability, setAvailability] = useState(100);
    const [quantity, setQuantity] = useState('');

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(e.target.value);
    };

    const handleCheckout = async () => {
        const qty = Number(quantity) || 0;
        if (qty > 0 && qty <= availability) {
            try {
                await axios.post(`${API_URL}/checkout_hardware`, {
                    projectId,
                    qty
                });
                setAvailability(availability - qty);
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
                    projectId,
                    qty
                });
                setAvailability(availability + qty);
            } catch (err) {
                console.error(err);
                alert('Check-in failed');
            }
        }
        setQuantity('');
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: 4, marginBottom: 4 }}>
                <div style={{ minWidth: 160 }}>{label}: {availability}/{capacity}</div>
                <div>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        placeholder="Enter Quantity"
                        min="0"
                        value={quantity}
                        onChange={handleQuantityChange}
                        style={{ width: 100 }}
                    />
                </div>
                <button onClick={handleCheckout}>Check-out</button>
                <button onClick={handleCheckin}>Check-in</button>
            </div>
        </div>
    );
};

export default HardwareManagement;
