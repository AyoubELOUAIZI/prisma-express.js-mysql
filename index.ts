import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';



const app = express();
app.use(express.json());
//Instantiate a new PrismaClient instance
const prisma = new PrismaClient()

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

//---------------------------------------------------------------------//
//i descuver that prisma can now if data is already exists in the database yes but when you add unique to a fieled
app.post('/many', async (req: Request, res: Response) => {
    const { users } = req.body;
    try {
        // Validate input
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ error: 'Invalid input, expected an array of users' });
        }
        // Create users
        const createdUsers = await prisma.user.createMany({ data: users });
        // Return created users
        console.log(createdUsers)
        res.json(createdUsers);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
});

//---------------------------------------------------------------------//
app.post('/', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ error: 'Both username and password are required' });
    }

    try {
        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password
            }
        });

        res.json(user);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: (error as any).message });
    }
});

//---------------------------------------------------------------------//
app.get('/all', async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany({include:{cars:true}})
        res.json(allUsers);
    } catch (error) {
        console.error(error)
        res.status(500).send('An error occurred while fetching all users')
    }
});

//---------------------------------------------------------------------//
//this one should improve
//to get one user //now it is good with findUnique
app.get('/one/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});
//---------------------------------------------------------------------//

app.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const { username, password } = req.body
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { username, password },
        })
        // res.json(user)
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error)
        res.status(500).send(`An error occurred while updating user with id ${id}`)
    }
})

//---------------------------------------------------------------------//

app.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        res.json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
});

//---------------------------------------------------------------------//
app.post('/car/many', async (req: Request, res: Response) => {
    const { cars } = req.body;
    try {
        // Validate input
        if (!Array.isArray(cars) || cars.length === 0) {
            return res.status(400).json({ error: 'Invalid input, expected an array of cars' });
        }
        // Create car
        const createdCars = await prisma.car.createMany({ data: cars });
        // Return created users
        console.log(createdCars)
        res.json(createdCars);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
});
//---------------------------------------------------------------------//

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
