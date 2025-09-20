'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';
import Header from '@/components/Header';
import { loadRazorpayScript } from '../../../../lib/rozorpay';
import { toast } from 'sonner';
import { useSession } from "next-auth/react";

interface EventType {
  _id: string;
  title: string;
  thumbnail: string;
  ticketPrice: number;
}

export default function TicketBookingPage() {
  const { id } = useParams();
    const { data: session } = useSession();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
        console.log('Fetched event:', res.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <ClipLoader color="#8b5cf6" size={60} />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  const totalPrice = event ? event.ticketPrice * quantity : 0;

  //  Handle payment
  const handlePayment = async () => {
    if (!event) return;

    if (!session?.user?.id) {
      router.push("/auth/signin");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Check your internet connection.');
      return;
    }

    try {
      // Create order on backend
      const orderRes = await axios.post('/api/payment/create-order', {
        amount: totalPrice * 100,
      });

      const { order } = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Revelo',
        description: `Tickets for ${event.title}`,
        image: '/favicon.png',
        order_id: order.id,
        handler: async function (response: any) {
          try {

            const res = await axios.post('/api/payment/verify-ticket-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id,
              quantity,
              amount: totalPrice,
            });

            if (res.data.success) {
              toast.success("Payment successful! Ticket issued ");
              router.push("/dashboard");
            } else {
              toast.error(res.data.message || "Payment verification failed!");
            }
          } catch (err) {
            console.error('Ticket issue failed:', err);
            toast.error('Payment succeeded but ticket issuing failed!');
          }
        },
        prefill: {
          name: 'Revelo User',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#8b5cf6',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black p-6 flex justify-center items-start">
        <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-3xl overflow-hidden mt-8">
          {event && (
            <>
              <div className="relative w-full h-64">
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-lg text-gray-300">Price per ticket:</p>
                  <span className="text-xl font-semibold text-purple-400">
                    ₹{event.ticketPrice}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-lg text-gray-300">Quantity:</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 bg-gray-700 rounded-md text-lg font-bold"
                    >
                      –
                    </button>
                    <span className="text-xl font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1 bg-gray-700 rounded-md text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between mb-8">
                  <p className="text-lg text-gray-300">Total:</p>
                  <span className="text-2xl font-bold text-green-400">
                    ₹{totalPrice}
                  </span>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handlePayment}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition"
                >
                  Proceed to Pay
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
