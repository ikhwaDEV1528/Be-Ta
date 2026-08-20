import jwt from "jsonwebtoken"

export function CheckToken(req, res, next) {

    try {

        // ambil token dari cookie
        const token = req.cookies.access_token

        // cek ada token atau tidak
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token tidak ada"
            })
        }

        // verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // simpan data user ke request
        req.user = decoded

        // lanjut ke endpoint berikutnya
        next()

    } catch (error) {

        return res.status(403).json({
            success: false,
            message: "Token tidak valid"
        })

    }
}