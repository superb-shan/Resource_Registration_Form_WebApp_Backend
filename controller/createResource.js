const { Sequelize, where } = require("sequelize");
const Resource = require("../models/resource");

const resourceData = [
    {
        name: '1st floor Auditorium',
        type: 'Auditorium/Training Halls',
        capacity: 400,
    },
    {
        name: '2nd floor Auditorium',
        type: 'Auditorium/Training Halls',
        capacity: 400,
    },
    {
        name: 'IT Auditorium',
        type: 'Auditorium/Training Halls',
        capacity: 120,
    },
    {
        name: 'Code Studio',
        type: 'Auditorium/Training Halls',
        capacity: 166,
    },
    {
        name: '3rd Floor Drawing Hall',
        type: 'Auditorium/Training Halls',
        capacity: 350,
    },
    {
        name: 'Makerspace',
        type: 'Special Halls',
        capacity: 100,
    },
    {
        name: 'Ignite',
        type: 'Special Halls',
        capacity: 100,
    },
    {
        name: 'Iot laboratory',
        type: 'Special Halls',
        capacity: 100,
    },
    {
        name: 'GF-07',
        type: 'Special Halls',
        capacity: 40,
    },
    {
        name: 'Cyber Security & Hypernet',
        type: 'Special Halls',
        capacity: 75,
    },
    {
        name: 'AI Robo Space',
        type: 'Special Halls',
        capacity: 75,
    },
    {
        name: 'Bytes laboratory',
        type: 'Academic Labs',
        capacity: 64,
    },
    {
        name: 'IP laboratory',
        type: 'Academic Labs',
        capacity: 67,
    },
    {
        name: 'Fullstack laboratory',
        type: 'Academic Labs',
        capacity: 70,
    },
    // Add data for other categories as well
    // 'Project laboratory', 'CAD laboratory', 'Simulation laboratory', etc.
    {
        name: 'Ignite Board Room',
        type: 'Board Rooms',
        capacity: 10,
    },
    {
        name: 'IQAC Board Room',
        type: 'Board Rooms',
        capacity: 10,
    },
    {
        name: 'Office Board Room',
        type: 'Board Rooms',
        capacity: 10,
    },
];

const createResourceData = async () => {
    try {
        for (const resource of resourceData) {
            await Resource.create({
                name: resource.name,
                type: resource.type,
                capacity: resource.capacity,
            });
        }
        console.log('Resource data created successfully');
    } catch (error) {
        console.error('Error creating resource data:', error);
    }
};

createResourceData();
