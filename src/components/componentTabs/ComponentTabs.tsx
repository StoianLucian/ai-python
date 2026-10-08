import { Tabs, Tab, Box } from '@mui/material';
import React, { useState } from 'react'

type ComponentTabItem = {
    label: string
    element: React.ReactNode
}

type ComponentTabsProps = {
    items: ComponentTabItem[]
}
export default function ComponentTabs({ items }: ComponentTabsProps) {

    const [currentTab, setCurrentTab] = useState(0)

    const handleCurrentTab = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setCurrentTab(newValue);
    };

    function renderTabs(items: ComponentTabItem[]) {

        const tabs = items.map((item, i) => {
            return (
                <Tab key={i} value={i} label={item.label} />
            )
        })
        return tabs
    }

    function renderElements(items: ComponentTabItem[]) {

        const tabComponents = items.map((item, i) => {
            return (
                <Box
                    key={i}
                    className={`${currentTab === i ? "block" : "hidden"}`}
                >
                    {item.element}
                </Box>
            )
        })

        return tabComponents
    }
    return (
        <Box className="flex justify-center items-center flex-col w-full lg:w-70 h-[45vh] lg:h-screen bg-white border-r border-[#ECEAE4]">
            <Tabs value={currentTab} onChange={handleCurrentTab}>
                {renderTabs(items)}
            </Tabs>
            <Box className="w-full p-5 flex-1 overflow-y-auto">
                {renderElements(items)}
            </Box>
        </Box>
    )
}
