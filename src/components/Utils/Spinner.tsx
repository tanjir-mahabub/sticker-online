
const Spinner = () => {
    return (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-sm z-[100]">
            <div className="w-20 h-20">
                <svg className="radial-loader" data-mode="buffer" width="80" height="80">
                    <circle className="radial-loader__circle" stroke="#fff" strokeWidth="3" fill="transparent" r="20" cx="40" cy="40" style={{ strokeDasharray: "6 6.5" }}></circle>
                    <circle className="radial-loader__circle-path" stroke="rgba(255,255,255,.2)" strokeWidth="3" fill="transparent" r="20" cx="40" cy="40"></circle>
                </svg>
            </div>
        </div>
    )
}

export default Spinner