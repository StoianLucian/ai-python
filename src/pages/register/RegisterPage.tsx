import { Controller, useForm } from 'react-hook-form'


import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import { useRegister } from '../../api/hooks/tanstack/useRegister'
import AuthForm from '../../components/Auth/AuthForm'
import InputComponent, { InputComponentEnum } from '../../components/inputComponent/InputComponent'
import NavigationLink from '../../components/navigationLink/NavigationLink'
import { APP_PATHS } from '../../routing/routes'
import { translations } from '../../../i18n'

export type RegisterCredentials = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

const defaultValues: RegisterCredentials = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
}

function RegisterPage() {
    const { t } = useTranslation()

    const methods = useForm<RegisterCredentials>({
        defaultValues
    })

    const { control, handleSubmit, watch } = methods

    const { mutateAsync: registerHandler, isPending } = useRegister()

    const submitData = async (data: RegisterCredentials) => {
        try {
            await registerHandler(data)
        } catch (error) {

        }
    }

    return (
        <AuthForm onSubmit={handleSubmit(submitData)} btnText={t(translations.registerPage.register)} isPending={isPending} title={t(translations.registerPage.register)}>
            <Controller
                name="username"
                control={control}
                rules={{
                    required: t(`${translations.errors.isRequired}`, { field: t(`${translations.registerPage.username}`) })
                }}
                render={({ field, fieldState: { error } }) => (
                    <InputComponent
                        label={t(translations.registerPage.username)}
                        value={field.value}
                        onChange={field.onChange}
                        helperText={error?.message}
                        error={!!error?.message}
                    />
                )} />
            <Controller
                name="email"
                control={control}
                rules={
                    {
                        required: t(translations.errors.isRequired, { field: t(translations.registerPage.email) }),
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: t(translations.errors.invalidEmail)
                        }
                    }
                }
                render={({ field, fieldState: { error } }) => (
                    <InputComponent
                        label={t(translations.registerPage.email)}
                        value={field.value}
                        onChange={field.onChange}
                        helperText={error?.message}
                        error={!!error?.message}
                        type={InputComponentEnum.EMAIL}
                    />
                )} />
            <Controller
                name="password"
                control={control}
                rules={{ required: t(translations.errors.isRequired, { field: t(translations.registerPage.password) }) }}
                render={({ field, fieldState: { error } }) => (
                    <InputComponent
                        label={t(translations.registerPage.password)}
                        value={field.value}
                        onChange={field.onChange}
                        helperText={error?.message}
                        type={InputComponentEnum.PASSWORD}
                        error={!!error?.message}
                    />
                )}
            />
            <Controller
                name="confirmPassword"
                control={control}
                rules={{
                    required: t(translations.errors.isRequired, { field: t(translations.registerPage.confirmPassword) }),
                    validate: (value) => {
                        if (value !== watch("password")) {
                            return t(translations.errors.passwordsDoNotMatch)
                        }
                    }
                }}
                render={({ field, fieldState: { error } }) => (
                    <InputComponent
                        label={t(translations.registerPage.confirmPassword)}
                        value={field.value}
                        onChange={field.onChange}
                        helperText={error?.message}
                        type={InputComponentEnum.PASSWORD}
                        error={!!error?.message}
                    />
                )}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <NavigationLink to={APP_PATHS.LOGIN} linkText={t(translations.registerPage.alreadyHaveAccount)} />
            </Stack>
        </AuthForm>
    )
}

export default RegisterPage