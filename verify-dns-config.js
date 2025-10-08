const dns = require('dns').promises

const domain = 'test-psychotechnique-permis.com'

async function verifyDNS() {
  console.log('🔍 Vérification de la configuration DNS pour éviter les spams\n')
  console.log(`Domaine: ${domain}\n`)
  console.log('━'.repeat(60))

  // Vérifier SPF
  console.log('\n📧 1. SPF (Sender Policy Framework)')
  console.log('━'.repeat(60))
  try {
    const txtRecords = await dns.resolveTxt(domain)
    const spfRecord = txtRecords.find(record => 
      record.join('').includes('v=spf1')
    )
    
    if (spfRecord) {
      console.log('✅ SPF trouvé:')
      console.log(`   ${spfRecord.join('')}`)
      
      if (spfRecord.join('').includes('elasticemail.com')) {
        console.log('   ✅ Elastic Email inclus')
      } else {
        console.log('   ⚠️  Elastic Email NON inclus - À ajouter!')
      }
    } else {
      console.log('❌ SPF NON trouvé')
      console.log('   Ajoutez: v=spf1 include:_spf.elasticemail.com include:mx.ovh.com ~all')
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification SPF:', error.message)
  }

  // Vérifier DKIM
  console.log('\n🔐 2. DKIM (DomainKeys Identified Mail)')
  console.log('━'.repeat(60))
  try {
    const dkimDomain = `api._domainkey.${domain}`
    const cnameRecords = await dns.resolveCname(dkimDomain)
    
    if (cnameRecords && cnameRecords.length > 0) {
      console.log('✅ DKIM trouvé:')
      console.log(`   ${dkimDomain} → ${cnameRecords[0]}`)
      
      if (cnameRecords[0].includes('elasticemail')) {
        console.log('   ✅ Pointe vers Elastic Email')
      }
    }
  } catch (error) {
    console.log('❌ DKIM NON trouvé')
    console.log('   Ajoutez CNAME: api._domainkey → api.elasticemail.net')
  }

  // Vérifier DMARC
  console.log('\n🛡️  3. DMARC (Domain-based Message Authentication)')
  console.log('━'.repeat(60))
  try {
    const dmarcDomain = `_dmarc.${domain}`
    const txtRecords = await dns.resolveTxt(dmarcDomain)
    const dmarcRecord = txtRecords.find(record => 
      record.join('').includes('v=DMARC1')
    )
    
    if (dmarcRecord) {
      console.log('✅ DMARC trouvé:')
      console.log(`   ${dmarcRecord.join('')}`)
    } else {
      console.log('⚠️  DMARC NON trouvé (recommandé)')
      console.log('   Ajoutez TXT sur _dmarc:')
      console.log('   v=DMARC1; p=none; rua=mailto:f.sebti@outlook.com')
    }
  } catch (error) {
    console.log('⚠️  DMARC NON trouvé (recommandé)')
    console.log('   Ajoutez TXT sur _dmarc:')
    console.log('   v=DMARC1; p=none; rua=mailto:f.sebti@outlook.com')
  }

  // Vérifier Bounce
  console.log('\n↩️  4. Bounce/Return-Path')
  console.log('━'.repeat(60))
  try {
    const bounceDomain = `bounce.${domain}`
    const cnameRecords = await dns.resolveCname(bounceDomain)
    
    if (cnameRecords && cnameRecords.length > 0) {
      console.log('✅ Bounce CNAME trouvé:')
      console.log(`   bounce → ${cnameRecords[0]}`)
    }
  } catch (error) {
    console.log('⚠️  Bounce CNAME NON trouvé')
    console.log('   Ajoutez CNAME: bounce → bounces.elasticemail.net')
  }

  // Vérifier MX
  console.log('\n📬 5. MX Records (Mail Exchange)')
  console.log('━'.repeat(60))
  try {
    const mxRecords = await dns.resolveMx(domain)
    
    if (mxRecords && mxRecords.length > 0) {
      console.log('✅ MX Records trouvés:')
      mxRecords.forEach(mx => {
        console.log(`   Priority ${mx.priority}: ${mx.exchange}`)
      })
    }
  } catch (error) {
    console.log('⚠️  Aucun MX record trouvé')
  }

  // Résumé et recommandations
  console.log('\n' + '━'.repeat(60))
  console.log('📊 RÉSUMÉ ET RECOMMANDATIONS')
  console.log('━'.repeat(60))
  console.log('\n✅ Actions à faire pour éviter les spams:')
  console.log('\n1. Vérifiez que tous les DNS sont configurés (SPF, DKIM, DMARC, Bounce)')
  console.log('2. Testez vos emails sur: https://www.mail-tester.com/')
  console.log('3. Vérifiez votre réputation: https://senderscore.org/')
  console.log('4. Consultez le guide: GUIDE-ANTI-SPAM-EMAIL.md')
  console.log('\n💡 Astuce: Demandez aux destinataires d\'ajouter')
  console.log('   contact@test-psychotechnique-permis.com à leurs contacts')
  console.log('\n🔗 Outils de vérification:')
  console.log('   • MXToolbox: https://mxtoolbox.com/SuperTool.aspx')
  console.log('   • Google Admin: https://toolbox.googleapps.com/apps/checkmx/')
  console.log('   • Mail Tester: https://www.mail-tester.com/')
  console.log('\n')
}

verifyDNS()
