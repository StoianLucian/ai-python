import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLookupFood } from '../../api/hooks/tanstack/useLookupFood'
import { translations } from '../../../i18n'

function LookupPage() {
    const { t } = useTranslation()
    const [name, setName] = useState('')
    const { mutate, data, isPending, isError } = useLookupFood()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const trimmed = name
        if (!trimmed) return
        mutate(trimmed)
    }

    return (
        <div style={{ maxWidth: 480, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h1>{t(translations.lookupPage.title)}</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t(translations.lookupPage.placeholder)}
                    style={{ flex: 1 }}
                />
                <button type="submit" disabled={isPending || !name.trim()}>
                    {isPending ? t(translations.lookupPage.loading) : t(translations.lookupPage.submit)}
                </button>
            </form>

            {isError && <p style={{ color: 'crimson' }}>{t(translations.lookupPage.error)}</p>}
            {JSON.stringify(data)}
            {/* {data && (
                data.found ? (
                    <ul>
                        <li><strong>{data.name}</strong>{data.source ? ` (${data.source})` : ''}</li>
                        <li>Calories: {data.calories_per_100g ?? '—'} / 100g</li>
                        <li>Protein: {data.protein_per_100g ?? '—'} g / 100g</li>
                        <li>Carbs: {data.carbs_per_100g ?? '—'} g / 100g</li>
                        <li>Fat: {data.fat_per_100g ?? '—'} g / 100g</li>
                    </ul>
                ) : (
                    <p>No macros found for “{data.name}”.</p>
                )
            )} */}
        </div>
    )
}

export default LookupPage
