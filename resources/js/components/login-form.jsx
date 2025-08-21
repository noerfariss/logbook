import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dayjs from "dayjs"
import { useForm, usePage } from "@inertiajs/react"
import AlertComponent from "./AlertComponent"
import TextError from "./TextError"
import ButtonComponent from "./ButtonComponent"
import { useState } from "react"
import { Checkbox } from "./ui/checkbox"

export function LoginForm({ className, ...props }) {
    const [isPassword, setIsPassword] = useState(true);
    const { logo, website } = usePage().props;


    const { data, setData, post, errors, processing } = useForm({
        username: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login.post'));
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {errors[0] && <AlertComponent title="Error" description={errors[0]} variant="destructive" />}

            <Card>
                <CardHeader className="text-center justify-center align-center items-center">
                    <img src={logo} width={200} className="mb-3" />

                    <CardTitle className="text-xl">{website}</CardTitle>
                    <CardDescription className='capitalize text-gray-900'>
                        sistem informasi logbook purchasing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" type="text" placeholder='Masukkan username Anda' value={data.username} onChange={(e) => setData('username', e.target.value)} />
                                    {(errors || errors.username) && <TextError message={errors.username} />}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type={isPassword ? 'password' : 'text'} placeholder='Masukkan password dengan benar' value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                    {(errors || errors.password) && <TextError message={errors.password} />}
                                </div>
                                <div className="flex items-center gap-2 mb-4 py-2 cursor-pointer">
                                    <Checkbox id="showpassword" onClick={() => setIsPassword(!isPassword)} />
                                    <Label htmlFor="showpassword">Tampilkan Password</Label>
                                </div>
                                <ButtonComponent isLoading={processing} />
                            </div>

                        </div>
                    </form>
                </CardContent>
            </Card>
            <div
                className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                &copy; Copyright {dayjs().format('YYYY')}
            </div>
        </div>
    );
}
