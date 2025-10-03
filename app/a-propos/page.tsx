import FAQ from '../components/FAQ'

export default function APropos() {
  return (
    <>

      {/* Passer son test psychotechnique proche de Paris */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
                Passer son test psychotechnique proche de Paris
              </h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Situé à <strong>Clichy en Île-de-France</strong>, notre centre de test psychotechnique se situe dans une zone bien desservie par le métro, le transilien et les bus. Proche de Paris, venez passer votre test rapidement et facilement. Prenez rendez-vous en quelques clics. Paiement sur place, aucun acompte ne vous sera demandé en ligne.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Permis annulé ? Invalidé ? Ou suspendu ? Récupérez votre permis en passant un test psychotechnique dans notre centre de Clichy dans le département des <strong>Hauts-de-Seine 92</strong>.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-8">
                  La psychologue chargée de la passation vous reçoit dans un cadre apaisant. Elle vous expliquera également les démarches ultérieures à suivre pour la récupération de votre permis de conduire en fonction de votre situation.
                </p>
                
                <div className="bg-slate-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Une deuxième chance gratuite en cas d'échec à votre test psychotechnique
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Le test psychotechnique peut être un moment stressant pour certains et il peut arriver que votre test soit un échec à cause de cela. Notre psychologue vous proposera de passer le test une deuxième fois gratuitement, pour vous donner toutes les chances de récupérer votre permis de conduire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qu'est-ce qu'un test psychotechnique */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
            Qu'est-ce qu'un test psychotechnique d'aptitude à la conduite ?
          </h2>
          
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700 leading-relaxed mb-8">
              Un test psychotechnique est réalisé par un psychologue agréé préfecture, il se déroule en deux temps :
            </p>
          </div>

          <div className="space-y-12">
            {/* 1ère étape */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-700 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1ère étape</h3>
                  <p className="text-gray-700 mb-4">
                    L'entretien individuel doit permettre d'aborder les points suivants :
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>La situation du conducteur (son histoire, sa situation familiale et professionnelle, sa santé, son hygiène de vie)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Les raisons de la sanction qui l'ont mené à une invalidation, une suspension ou une annulation du permis de conduire</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ses usages d'un véhicule motorisé (enjeux professionnels, personnels et sociaux)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Une confrontation aux faits, ayant justifié la sanction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Sa motivation à une réhabilitation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2ème étape */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-700 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2ème étape</h3>
                  <p className="text-gray-700 mb-4">
                    Les tests psychotechniques doivent en outre permettre l'exploration de divers champs de l'activité psychomotrice en lien avec la conduite tels que :
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>Les capacités visuo-attentionnelles</strong> (Capacités visuelles)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>La vitesse de traitement</strong> de l'information et la vitesse de réaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span><strong>La capacité de coordination</strong> des mouvements et les fonctions exécutives d'inhibition</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  )
}
