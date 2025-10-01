"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function Component() {
  const [activeTab, setActiveTab] = useState("segnalazione")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    telefono: "",
    descrizione: "",
    immagini: [] as File[],
    consensoPrivacy: false
  })

  const handleSegnalazioneClick = () => {
    setActiveTab("segnalazione")
    // Scroll al bottone su mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const buttonElement = document.querySelector('[data-button="segnalazione"]')
        if (buttonElement) {
          buttonElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      immagini: files
    }))
  }

  const uploadImages = async (files: File[]): Promise<Array<{url: string, filename: string}>> => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('images', file)
    })

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error || 'Errore nel caricamento delle immagini')
    }

    return result.images
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      // Carica le immagini su Cloudinary
      const immaginiCaricate = await uploadImages(formData.immagini)
      
      console.log('Immagini caricate:', immaginiCaricate)

      const response = await fetch('/api/segnalazioni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          immagini: immaginiCaricate
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitMessage("Segnalazione inviata con successo! Grazie per il tuo contributo.")
        // Reset del form
        setFormData({
          nome: "",
          cognome: "",
          email: "",
          telefono: "",
          descrizione: "",
          immagini: [],
          consensoPrivacy: false
        })
        // Reset del file input
        const fileInput = document.getElementById('immagini') as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setSubmitMessage(result.error || "Errore nell'invio della segnalazione. Riprova.")
      }
    } catch (error) {
      console.error('Errore:', error)
      setSubmitMessage("Errore di connessione. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Stato per le segnalazioni risolte
  const [segnalazioniRisolte, setSegnalazioniRisolte] = useState<any[]>([])
  const [isLoadingRisolte, setIsLoadingRisolte] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")

  // Carica le segnalazioni risolte
  const loadSegnalazioniRisolte = async (page: number = 1, search: string = "") => {
    setIsLoadingRisolte(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
        ...(search && { search })
      })

      const response = await fetch(`/api/segnalazioni-risolte?${params}`)
      const result = await response.json()

      if (result.success) {
        setSegnalazioniRisolte(result.data.records)
        setCurrentPage(result.data.pagination.currentPage)
        setTotalPages(result.data.pagination.totalPages)
        setTotalCount(result.data.pagination.totalCount)
      }
    } catch (error) {
      console.error('Errore nel caricamento segnalazioni risolte:', error)
    } finally {
      setIsLoadingRisolte(false)
    }
  }

  // Carica i dati quando si apre il tab "risolte"
  useEffect(() => {
    if (activeTab === "risolte" && segnalazioniRisolte.length === 0) {
      loadSegnalazioniRisolte()
    }
  }, [activeTab])

  // Gestione ricerca automatica
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value)
    
    // Attiva la ricerca dal terzo carattere
    if (value.length >= 3) {
      setSearchTerm(value)
      setCurrentPage(1)
      loadSegnalazioniRisolte(1, value)
    } else if (value.length === 0) {
      // Reset quando il campo è vuoto
      setSearchTerm("")
      setCurrentPage(1)
      loadSegnalazioniRisolte(1, "")
    }
  }

  // Gestione paginazione
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    loadSegnalazioniRisolte(newPage, searchTerm)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        {/* Titolo - Prima in mobile, nascosto in desktop */}
        <h1 className="text-3xl font-bold text-white text-center mb-6 lg:hidden">
          <div>Segnalalo al</div>
          <div>Consiglier Felipe</div>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sezione sinistra - Titolo, Foto e Descrizione */}
          <div className="space-y-4 lg:space-y-6">
            {/* Titolo desktop - sopra la foto */}
            <h1 className="hidden lg:block text-3xl font-bold text-white text-center">Segnalalo al Consiglier Felipe</h1>
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/images/felipe-sindaco.jpg"
                alt="Felipe Sindaco - Sistema di Segnalazione"
                width={800}
                height={320}
                className="w-full h-80 lg:h-[534px] object-cover object-center"
                style={{ objectPosition: 'center -20px' }}
              />
            </div>
            <p className="text-sm lg:text-lg text-slate-100 leading-relaxed">
              Buongiorno, sono Luigifilippo Garrone e sono uno dei consiglieri del Municipio I Centro Est. Sono stato
              eletto nel 2022 nella maggioranza e successivamente nel 2025 nell'opposizione. Il mio obiettivo
              principale è quello di risolvere le segnalazioni dei cittadini ed è per questo che ho creato questo
              sito. Come potete vedere, accanto alla mia foto si trova un modulo di contatto: basta compilarlo e
              allegare le foto per inviarmi la vostra segnalazione, che sarà presa in carico da me personalmente. Vi
              ringrazio per il vostro aiuto nel cercare di rendere ancora più bella la nostra meravigliosa città!
            </p>
          </div>

          {/* Sezione destra - Solo Tabs */}
          <div className="space-y-6">

            {/* Tabs */}
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
              <Button
                onClick={handleSegnalazioneClick}
                data-button="segnalazione"
                className={`flex-1 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "segnalazione"
                    ? "bg-sky-100 hover:bg-sky-200 text-slate-700 shadow-sm"
                    : "bg-slate-800 hover:bg-slate-900 text-white shadow-lg transform scale-105"
                }`}
              >
                Fai la tua segnalazione
              </Button>
              <Button
                onClick={() => setActiveTab("risolte")}
                className={`flex-1 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "risolte"
                    ? "bg-sky-100 hover:bg-sky-200 text-slate-700 shadow-sm"
                    : "bg-slate-800 hover:bg-slate-900 text-white shadow-lg transform scale-105"
                }`}
              >
                Vedi le segnalazioni risolte
              </Button>
            </div>

            {/* Contenuto dei Tabs - Ora più alto */}
            <Card className="shadow-2xl bg-sky-100/95 backdrop-blur-sm border-0">
              {activeTab === "segnalazione" ? (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-700">Invia una Segnalazione</CardTitle>
                    <CardDescription>Compila tutti i campi per inviarci la tua segnalazione</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Nome e Cognome */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome</Label>
                          <Input 
                            id="nome" 
                            name="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            placeholder="Il tuo nome" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cognome">Cognome</Label>
                          <Input 
                            id="cognome" 
                            name="cognome"
                            value={formData.cognome}
                            onChange={handleInputChange}
                            placeholder="Il tuo cognome" 
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="la-tua-email@esempio.com" 
                          required
                        />
                      </div>

                      {/* Telefono */}
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Telefono</Label>
                        <Input 
                          id="telefono" 
                          name="telefono"
                          type="tel" 
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+39 123 456 7890" 
                        />
                      </div>

                      {/* Descrizione */}
                      <div className="space-y-2">
                        <Label htmlFor="descrizione">Descrizione della Segnalazione *</Label>
                        <Textarea
                          id="descrizione"
                          name="descrizione"
                          value={formData.descrizione}
                          onChange={handleInputChange}
                          placeholder="Descrivi dettagliatamente la tua segnalazione..."
                          className="min-h-[150px] resize-none"
                          required
                        />
                      </div>

                      {/* Upload Immagini */}
                      <div className="space-y-2">
                        <Label htmlFor="immagini">Allega almeno 2 foto della situazione *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Trascina le immagini qui o clicca per selezionare</p>
                            <Input 
                              id="immagini" 
                              name="immagini"
                              type="file" 
                              multiple 
                              accept="image/*" 
                              onChange={handleFileChange}
                              className="hidden" 
                              required 
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById("immagini")?.click()}
                            >
                              Seleziona File
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Formati supportati: JPG, PNG, GIF (max 10MB per file)
                          </p>
                          {formData.immagini.length > 0 && (
                            <p className="text-sm text-green-600 mt-2">
                              {formData.immagini.length} file selezionati
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Consenso Privacy */}
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="consensoPrivacy" 
                            name="consensoPrivacy"
                            checked={formData.consensoPrivacy}
                            onChange={handleInputChange}
                            required 
                            className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                          />
                          <label htmlFor="consensoPrivacy" className="text-sm text-gray-600 leading-relaxed">
                            Accetto il trattamento dei miei dati personali secondo la{" "}
                            <a href="/privacy" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                              Privacy Policy
                            </a>
                            . I dati saranno utilizzati esclusivamente per gestire la segnalazione e potranno essere conservati per un massimo di 10 anni.
                          </label>
                        </div>
                      </div>

                      {/* Messaggio di feedback */}
                      {submitMessage && (
                        <div className={`p-4 rounded-lg text-center ${
                          submitMessage.includes('successo') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {submitMessage}
                        </div>
                      )}

                      {/* Pulsante Invio */}
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.consensoPrivacy}
                        className="w-full bg-slate-800 hover:bg-slate-900 py-3 disabled:opacity-50"
                      >
                        {isSubmitting ? "Invio in corso..." : "Invia Segnalazione"}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">I campi contrassegnati con * sono obbligatori</p>
                    </form>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-700">
                      Segnalazioni Risolte
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                      <CardDescription>Ecco le segnalazioni che sono state risolte di recente</CardDescription>
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold self-start lg:self-auto">
                        {totalCount} risolte
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Barra di ricerca */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Cerca per titolo o luogo (minimo 3 caratteri)..."
                          value={searchInput}
                          onChange={(e) => handleSearchInputChange(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {searchTerm && (
                        <p className="text-sm text-gray-600 mt-2">
                          Risultati per: "{searchTerm}" ({totalCount} trovati)
                        </p>
                      )}
                      {searchInput.length > 0 && searchInput.length < 3 && (
                        <p className="text-sm text-gray-500 mt-2">
                          Inserisci almeno 3 caratteri per cercare
                        </p>
                      )}
                    </div>

                    {/* Lista segnalazioni */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {isLoadingRisolte ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                          <p className="text-gray-600 mt-2">Caricamento...</p>
                        </div>
                      ) : segnalazioniRisolte.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-600">
                            {searchTerm ? 'Nessuna segnalazione trovata per la ricerca' : 'Nessuna segnalazione risolta'}
                          </p>
                        </div>
                      ) : (
                        segnalazioniRisolte.map((segnalazione) => (
                          <div
                            key={segnalazione.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-4 lg:p-5"
                          >
                            {/* Layout mobile: stack verticale */}
                            <div className="flex flex-col lg:hidden space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Risolta il {new Date(segnalazione.dataRisoluzione).toLocaleDateString('it-IT')}
                                </div>
                                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {segnalazione.numeroSegnalazioni} {segnalazione.numeroSegnalazioni !== 1 ? 'segnalazioni' : 'segnalazione'}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-700 text-base mb-1">{segnalazione.titolo}</h3>
                                <p className="text-sm text-gray-600">
                                  📍 {segnalazione.luogo}
                                </p>
                              </div>
                            </div>

                            {/* Layout desktop: layout orizzontale */}
                            <div className="hidden lg:flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Risolta il {new Date(segnalazione.dataRisoluzione).toLocaleDateString('it-IT')}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-700">{segnalazione.titolo}</h3>
                                  <p className="text-sm text-gray-600">
                                    📍 {segnalazione.luogo}
                                  </p>
                                </div>
                              </div>
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {segnalazione.numeroSegnalazioni} {segnalazione.numeroSegnalazioni !== 1 ? 'segnalazioni' : 'segnalazione'}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Paginazione */}
                    {totalPages > 1 && (
                      <div className="mt-6 pt-4 border-t">
                        {/* Info paginazione - mobile e desktop */}
                        <div className="text-sm text-gray-600 mb-4 text-center lg:text-left">
                          Pagina {currentPage} di {totalPages} ({totalCount} totali)
                        </div>
                        
                        {/* Controlli paginazione - mobile */}
                        <div className="flex flex-col gap-2 lg:hidden">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="flex-1"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Precedente
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="flex-1"
                            >
                              Successiva
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>

                        {/* Controlli paginazione - desktop */}
                        <div className="hidden lg:flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Pagina {currentPage} di {totalPages} ({totalCount} totali)
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              Precedente
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Successiva
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
