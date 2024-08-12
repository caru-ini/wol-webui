# wol-webui

## Description

This is a web interface for the Wake-On-LAN (WOL) service. It is a simple web interface that allows users to send WOL packets to devices on the network.

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `docker compose up -d`
4. Access the web interface at `http://localhost:3030`

## Usage

1. Check your computer MAC address on bios or network settings
2. Enable Wake-On-LAN on your computer (bios or windows settings)
3. Add a new device via the web interface
4. Enjoy!

## API

The API is available at `http://localhost:3030/api/devices`

- GET `/` - Get devices list
- POST `/` - Create a new device
- PUT `/:id` - Update device by id
- GET `/:id` - Get device by id
- DELETE `/:id` - Delete device by id
- POST `/:id/wake` - Send WOL packet to device by id

## Prisma studio

If you want to access the database, you can run `npx prisma studio` and access the database at `http://localhost:5555`

## License

[MIT](LICENSE)
