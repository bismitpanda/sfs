import { writeText } from "@tauri-apps/api/clipboard";
import { ActionType } from "@type/ActionType";
import { MenuItemType } from "@type/MenuItemType";
import { ModalEnum } from "@type/ModalEnum";
import { Record } from "@type/Record";
import {
    Copy,
    Info,
    Pencil,
    Pin,
    PinOff,
    SendHorizonal,
    Trash2,
    Upload,
} from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";

import { useAppStateContext } from "./useAppStateContext";
import { useModalContext } from "./useModalContext";

export const useContextMenu = (setEditing: (id: number) => void) => {
    const { appState, dispatch } = useAppStateContext();
    const { openModal } = useModalContext();
    const [menuState, setMenuState] = useState<{
        open: boolean;
        items: MenuItemType[];
        clientX: number;
        clientY: number;
        pageY: number;
        pageX: number;
    }>({ open: false, items: [], clientX: 0, clientY: 0, pageX: 0, pageY: 0 });

    const closeMenu = () =>
        setMenuState((state) => ({
            ...state,
            items: [],
            open: false,
        }));

    const getItems = (record: Record) => {
        const isPinned = appState.pinned.some((obj) => obj.id === record.id);
        const midItems =
            record.inner.tag === "File"
                ? [
                      {
                          label: "Move To",
                          icon: SendHorizonal,
                          onClick: () => openModal(ModalEnum.SEND_TO, record),
                      },
                      {
                          label: "Export",
                          icon: Upload,
                          onClick: () =>
                              dispatch({
                                  type: ActionType.EXPORT,
                                  payload: record,
                              }),
                      },
                  ]
                : [];

        return [
            {
                label: "Copy Path",
                icon: Copy,
                onClick: async () =>
                    await writeText(
                        [
                            "",
                            ...appState.workingDir.map(
                                (segment) => segment.name,
                            ),
                            record.name,
                        ].join("/"),
                    ),
            },
            {
                label: "Rename",
                icon: Pencil,
                onClick: () => setEditing(record.id),
            },
            ...midItems,
            {
                label: "Delete",
                icon: Trash2,
                onClick: () => {
                    dispatch({
                        type: ActionType.DELETE,
                        payload: [record],
                    });
                },
            },
            {
                label: "Info",
                icon: Info,
                onClick: () => openModal(ModalEnum.INFO, record),
            },
            isPinned
                ? {
                      label: "Unpin",
                      icon: PinOff,
                      onClick: () => {
                          dispatch({
                              type: ActionType.UNPIN,
                              payload: record.id,
                          });
                      },
                  }
                : {
                      label: "Pin",
                      icon: Pin,
                      onClick: () => {
                          dispatch({
                              type: ActionType.PIN,
                              payload: record,
                          });
                      },
                  },
        ];
    };

    const handleOnContextMenu = (ev: MouseEvent, record: Record) => {
        ev.preventDefault();
        setMenuState({
            items: getItems(record),
            open: true,
            ...ev,
        });
    };

    useEffect(() => {
        const handleClick = () => {
            if (menuState.open) {
                closeMenu();
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [menuState.open]);

    return {
        handleOnContextMenu,
        closeMenu,
        menuProps: { ...menuState, closeMenu },
    };
};
