export const getCard = (req, res) => {
    const { username } = req.params;
    const { color } = req.query;
    console.log(color);
    console.log(username);
    const backGround = `<svg width="1029" height="686" viewBox="0 0 1029 686" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1029" height="686" rx="41" fill="#${color || 'BC93FF'}"/>
    <mask id="mask0_0_1" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="1029" height="686">
    <rect width="1029" height="686" rx="41" fill="#${color || 'BC93FF'}"/>
    </mask>
    <g mask="url(#mask0_0_1)">
    <g opacity="0.4">
    <path d="M0 650.873H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 669.47H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 688.066H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 632.277H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 613.681H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 595.084H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 576.488H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 557.892H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 539.295H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 520.699H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 502.102H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 483.506H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 464.91H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 446.313H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 427.717H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 409.12H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 390.524H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 371.928H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 353.331H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 334.735H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 316.139H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 297.542H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 278.946H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 260.349H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 241.753H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 223.157H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 204.56H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 185.964H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 167.367H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 148.771H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 130.175H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 111.578H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 92.9819H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 74.3855H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 55.7892H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 37.1928H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 18.5964H1029" stroke="#F8F8F8" stroke-width="5"/>
    <path d="M0 0H1029" stroke="#F8F8F8" stroke-width="5"/>
    </g>
    </g>
    </svg>
    `

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(backGround)
}