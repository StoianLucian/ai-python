import { Checkbox, FormControlLabel, Stack } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import AuthForm from '../../components/Auth/AuthForm'
import InputComponent, { InputComponentEnum } from '../../components/inputComponent/InputComponent'
import { useTranslation } from 'react-i18next';
import { useLogin } from '../../api/hooks/tanstack/useLogin';
import { APP_PATHS } from '../../routing/routes';
import NavigationLink from '../../components/navigationLink/NavigationLink';
import { translations } from '../../../i18n';
import { useAuthContext } from '../../api/context/authContext/AuthContext';


export type LoginCredentials = {
    account: string,
    password: string,
    remember: boolean
}

const defaultValues: LoginCredentials = {
    account: "",
    password: "",
    remember: false

}

function LoginPage() {

    const { t } = useTranslation()
    const methods = useForm<LoginCredentials>({
        defaultValues
    })

    const { setUser, setIsAuthenticated } = useAuthContext()

    const { control, handleSubmit } = methods

    const { mutateAsync: loginHandler, isPending } = useLogin()

    function handleLogin(user: { id: string, username: string, email: string }) {
        setUser(user)
        setIsAuthenticated(true)
    }

    const submitData = async (data: LoginCredentials) => {
        try {
            const user = await loginHandler(data);

            handleLogin(user)
        } catch (error) {

        }
    }

    return (
        <AuthForm onSubmit={handleSubmit(submitData)} btnText={t(translations.loginPage.login)} isPending={isPending} title={t(translations.loginPage.login)} >
            <Controller
                name="account"
                control={control}
                rules={{ required: t(translations.errors.isRequired, { field: t(translations.loginPage.account) }) }}
                render={({ field, fieldState: { error } }) => (
                    <InputComponent
                        label={t(t(translations.loginPage.account))}
                        value={field.value}
                        onChange={field.onChange}
                        helperText={error?.message}
                        error={!!error?.message}
                    />
                )} />
            <Controller
                name="password"
                control={control}
                rules={{ required: t(translations.errors.isRequired, { field: t(translations.loginPage.registerNewAccount) }) }}
                render={({ field, fieldState: { error } }) => (
                    <InputComponent
                        label={t(translations.loginPage.password)}
                        value={field.value}
                        onChange={field.onChange}
                        helperText={error?.message}
                        error={!!error?.message}
                        type={InputComponentEnum.PASSWORD}
                    />
                )}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                        <FormControlLabel
                            control={<Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />}
                            label={t(translations.loginPage.rememberMe)}
                        />
                    )}
                />
                <NavigationLink to={APP_PATHS.REGISTER} linkText={t(translations.loginPage.registerNewAccount)} />
            </Stack>
        </AuthForm>
    )
}

export default LoginPage