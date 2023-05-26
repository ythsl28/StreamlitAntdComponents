import {Streamlit, ComponentProps, withStreamlitConnection} from "streamlit-component-lib";
import React, {useEffect, useState} from "react";
import type {MenuProps} from 'antd';
import {Menu, ConfigProvider} from 'antd';
import {strToNode, AlphaColor, getParent, getHrefKeys, getCollapseKeys, menuHeight} from "./custom.react";

const AntdMenu = (props: ComponentProps) => {
    //get data
    const items = props.args['items']
    const dsk = props.args['defaultSelectedKeys']
    const defaultOpenKeys = props.args['defaultOpenKeys']
    const expandAll = props.args['expandAll']
    const dok = expandAll ? getCollapseKeys(items) : defaultOpenKeys ? defaultOpenKeys : dsk && getParent(dsk, items)
    const size = props.args['size']
    const inlineIndent = props.args['inlineIndent']

    //state
    const [selectKey, setSelectKey] = useState([dsk])
    const [height, setHeight] = useState(menuHeight(dok, items))

    //component height
    useEffect(() => Streamlit.setFrameHeight(height))

    //callback
    const onSelect: MenuProps['onSelect'] = (e) => {
        //only not href item will fire
        let hrefKeys = getHrefKeys(items)
        if (hrefKeys.indexOf(e.key) === -1) {
            setSelectKey([e.key]);
            Streamlit.setComponentValue(e.key);
        }
    }
    const onOpenChange: MenuProps['onOpenChange'] = (e) => {
        //update component height
        setHeight(menuHeight(e, items))
    }

    // antd menu component
    return (
        <ConfigProvider
            theme={{
                components: {
                    //custom menu theme
                    Menu: {
                        radiusItem: 0,
                        radiusSubMenuItem: 0,
                        colorItemText: 'var(--text-color)',
                        colorGroupTitle: AlphaColor('--text-color', 0.8),
                        colorItemTextDisabled: AlphaColor('--text-color', 0.5),
                        colorItemTextHover: 'var(--primary-color)',
                        colorItemTextSelected: 'var(--primary-color)',
                        colorItemBgHover: AlphaColor(),
                        colorItemBgSelected: AlphaColor(),
                        colorSubItemBg: 'var(--background-color)',
                        colorItemBg: 'var(--background-color)',
                        colorActiveBarWidth: 4,
                        itemMarginInline: 0,
                        colorSplit: AlphaColor('--text-color', 0.3),
                        fontSize: size,
                        fontFamily: 'var(--font)'
                    },
                },
            }}
        >
            <Menu
                onSelect={onSelect}
                onOpenChange={onOpenChange}
                selectedKeys={selectKey}
                style={{borderRightWidth: 0}}
                defaultSelectedKeys={[dsk]}
                defaultOpenKeys={dok}
                mode={'inline'}
                items={strToNode(items)}
                inlineIndent={inlineIndent}
            />
        </ConfigProvider>
    );
};

export default withStreamlitConnection(AntdMenu)
