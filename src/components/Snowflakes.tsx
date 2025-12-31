import "../style/Snowflakes.scss"

export const Snowflakes = () => {
    return Array.from({ length: 50 }).map((_, inx) =>
        <div className="snowflake" key={inx} />
    )
}