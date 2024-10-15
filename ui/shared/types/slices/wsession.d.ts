import { PayloadAction } from '@reduxjs/toolkit';
interface WSessiontate {
    wSession: string | null;
}
export declare const wSessionSlice: import("@reduxjs/toolkit").Slice<WSessiontate, {
    setWSession: (state: import("immer").WritableDraft<WSessiontate>, action: PayloadAction<any>) => void;
}, "wSession", "wSession", import("@reduxjs/toolkit").SliceSelectors<WSessiontate>>;
export declare const setWSession: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "wSession/setWSession">;
declare const _default: import("redux").Reducer<WSessiontate>;
export default _default;
