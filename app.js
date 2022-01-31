const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
})

// Db.sync()
Db.authenticate()
    .then(console.log('Connexion à la bdd'))
    .catch((error) => console.log(error))

app.use(express.json())

app.use('/collect', collectRoutes)
app.use('/collectivity', collectivityRoutes)
app.use('/location', locationRoutes)
app.use('/report', reportRoutes)
app.use('/locationAsk', locationAskRoutes)
app.use('/reportType', reportTypeRoutes)
app.use('/user', userRoutes)