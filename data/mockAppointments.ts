export const mockAppointments = [
  {
    id: 'appt_1',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    time: '10:00 AM',
    service: 'Haircut',
    barber: 'Michael Johnson',
    status: 'confirmed',
    barberId: 'barber_1',
  },
  {
    id: 'appt_2',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
    time: '2:30 PM',
    service: 'Haircut & Beard Trim',
    barber: 'David Williams',
    status: 'pending',
    barberId: 'barber_2',
  },
  {
    id: 'appt_3',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    time: '11:15 AM',
    service: 'Beard Trim',
    barber: 'Michael Johnson',
    status: 'completed',
    barberId: 'barber_1',
  },
];