export const Loading=()=> <div className="state">Loading…</div>;
export const Empty=({children="Nothing found."})=><div className="state">{children}</div>;
export const ErrorState=({children="Unable to load data."})=><div className="state error">{children}</div>;
