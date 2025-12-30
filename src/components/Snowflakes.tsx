import "../style/Snowflakes.scss"

export const Snowflakes = () => {
    return Array(5).fill(
        <div className="snowflake" />
    )
}