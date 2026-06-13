import type { FaqItem } from '~/types/page-content'

type FaqCopy = {
  eyebrow: string
  title: string
  lead: string
  items: FaqItem[]
}

export const useBrandFaqFallback = (brand: 'freya' | 'tor', pageKey: 'home' | 'contacts' | 'masters' | 'privacy-policy' | 'services' | 'booking' = 'home') => {
  const { locale } = useLocale()

  return computed<FaqCopy>(() => {
    if (pageKey === 'booking') {
      if (brand === 'tor') {
        if (locale.value === 'ru') {
          return {
            eyebrow: 'FAQ',
            title: 'Вопросы о записи в Tor',
            lead: 'Короткие ответы о записи в барбершоп, выборе барбера, мужских услугах и свободных слотах в Tor Barbershop.',
            items: [
              { question: 'Можно ли записаться в Tor онлайн?', answer: 'Да, через сайт можно выбрать мужскую услугу, барбера и свободное время для визита в Tor Barbershop.' },
              { question: 'Можно ли выбрать конкретного барбера?', answer: 'Да, если у нужного барбера есть свободные слоты, его можно выбрать во время записи.' },
              { question: 'Нужно ли записываться заранее?', answer: 'Да, лучше бронировать время заранее, особенно на вечер, выходные и к конкретному барберу.' },
              { question: 'Можно ли записаться на стрижку и бороду сразу?', answer: 'Да, в процессе онлайн-записи можно выбрать одну или несколько услуг в рамках подходящей категории.' },
              { question: 'Есть ли запись на мужской маникюр, педикюр и массаж?', answer: 'Да, если эти услуги есть в активном каталоге Tor, они также доступны для онлайн-записи через сайт.' },
            ],
          }
        }

        if (locale.value === 'en') {
          return {
            eyebrow: 'FAQ',
            title: 'Tor Booking Questions',
            lead: 'Short answers about barbershop booking, choosing a barber, men’s services, and available appointment slots at Tor Barbershop.',
            items: [
              { question: 'Can I book Tor online?', answer: 'Yes, you can book online by choosing a men’s service, barber, and available time slot at Tor Barbershop.' },
              { question: 'Can I choose a specific barber?', answer: 'Yes, if the barber has open slots, you can select them during the booking flow.' },
              { question: 'Should I book in advance?', answer: 'Yes, booking ahead is recommended, especially for evenings, weekends, and specific barbers.' },
              { question: 'Can I book a haircut and beard service together?', answer: 'Yes, the online booking flow allows one or more compatible services inside the relevant category group.' },
              { question: 'Are men manicure, pedicure, and massage bookings available?', answer: 'Yes, when those services are active in the Tor catalog, they can also be booked online through the website.' },
            ],
          }
        }

        return {
          eyebrow: 'FAQ',
          title: 'Tor ամրագրման հարցեր',
          lead: 'Կարճ պատասխաններ Tor Barbershop-ում օնլայն ամրագրման, բարբերի ընտրության, տղամարդկանց ծառայությունների և ազատ ժամերի մասին։',
          items: [
            { question: 'Հնարավո՞ր է Tor-ում օնլայն ամրագրել։', answer: 'Այո, կայքի միջոցով կարող եք ընտրել տղամարդկանց ծառայությունը, բարբերին և ազատ ժամը Tor Barbershop այցի համար։' },
            { question: 'Կարո՞ղ եմ ընտրել կոնկրետ բարբերի։', answer: 'Այո, եթե բարդերն ունի ազատ ժամ, կարող եք ընտրել նրան ամրագրման ընթացքում։' },
            { question: 'Պե՞տք է նախապես ամրագրել։', answer: 'Այո, խորհուրդ է տրվում նախապես ամրագրել, հատկապես երեկոյան ժամերի, հանգստյան օրերի և կոնկրետ բարբերի համար։' },
            { question: 'Կարո՞ղ եմ միասին ամրագրել սանրվածք և մորուք։', answer: 'Այո, օնլայն ամրագրման ընթացքում կարող եք ընտրել մեկ կամ մի քանի համատեղելի ծառայություն համապատասխան կատեգորիայում։' },
            { question: 'Հասանելի՞ է տղամարդկանց manicure, pedicure և massage ամրագրումը։', answer: 'Այո, եթե այդ ծառայությունները կան Tor-ի ակտիվ կատալոգում, դրանք նույնպես հասանելի են կայքի միջոցով օնլայն ամրագրման համար։' },
          ],
        }
      }

      if (locale.value === 'ru') {
        return {
          eyebrow: 'FAQ',
          title: 'Вопросы об онлайн-записи',
          lead: 'Короткие ответы о записи в Freya Beauty Salon, выборе мастера, доступных услугах и свободных слотах в Ереване.',
          items: [
            { question: 'Можно ли записаться в Freya онлайн?', answer: 'Да, через сайт можно выбрать категорию, услугу, мастера и свободное время визита в Freya Beauty Salon.' },
            { question: 'Можно ли выбрать конкретного мастера?', answer: 'Да, если у мастера есть доступные слоты, его можно выбрать прямо в процессе записи.' },
            { question: 'Нужно ли записываться заранее?', answer: 'Да, особенно если вы хотите попасть на популярное время или к конкретному специалисту.' },
            { question: 'Можно ли записаться без регистрации?', answer: 'Да, сайт поддерживает бронирование без регистрации: достаточно оставить имя и телефон для подтверждения.' },
            { question: 'Можно ли записаться на маникюр, педикюр, массаж и косметологию через сайт?', answer: 'Да, активные услуги Freya, включая hair, nails, cosmetology, massage и другие beauty-направления, доступны для онлайн-записи.' },
          ],
        }
      }

      if (locale.value === 'en') {
        return {
          eyebrow: 'FAQ',
          title: 'Online Booking Questions',
          lead: 'Short answers about booking at Freya Beauty Salon, choosing a specialist, available services, and open appointment slots in Yerevan.',
          items: [
            { question: 'Can I book Freya online?', answer: 'Yes, you can book online by choosing a category, service, specialist, and available appointment time at Freya Beauty Salon.' },
            { question: 'Can I choose a specific specialist?', answer: 'Yes, if the specialist has available slots, you can select them directly during the booking flow.' },
            { question: 'Should I book in advance?', answer: 'Yes, especially if you want a popular time or a specific beauty specialist.' },
            { question: 'Can I book without registration?', answer: 'Yes, the site supports guest booking with just your name and phone number for confirmation.' },
            { question: 'Can I book manicure, pedicure, massage, and cosmetology online?', answer: 'Yes, active Freya services including hair, nails, cosmetology, massage, and other beauty categories are available for online booking.' },
          ],
        }
      }

      return {
        eyebrow: 'FAQ',
        title: 'Օնլայն ամրագրման հարցեր',
        lead: 'Կարճ պատասխաններ Freya Beauty Salon-ում օնլայն ամրագրման, մասնագետ ընտրելու, հասանելի ծառայությունների և ազատ ժամերի մասին Երևանում։',
        items: [
          { question: 'Հնարավո՞ր է Freya-ում օնլայն ամրագրել։', answer: 'Այո, կայքի միջոցով կարող եք ընտրել կատեգորիան, ծառայությունը, մասնագետին և այցի ազատ ժամը Freya Beauty Salon-ում։' },
          { question: 'Կարո՞ղ եմ ընտրել կոնկրետ մասնագետի։', answer: 'Այո, եթե մասնագետն ունի ազատ ժամեր, կարող եք ընտրել նրան հենց ամրագրման ընթացքում։' },
          { question: 'Պե՞տք է նախապես ամրագրել։', answer: 'Այո, հատկապես եթե ցանկանում եք պահանջված ժամ կամ կոնկրետ beauty մասնագետ։' },
          { question: 'Հնարավո՞ր է ամրագրել առանց գրանցման։', answer: 'Այո, կայքը թույլ է տալիս ամրագրել նաև առանց գրանցման. հաստատման համար բավական է նշել անունն ու հեռախոսահամարը։' },
          { question: 'Կարո՞ղ եմ կայքի միջոցով ամրագրել manicure, pedicure, massage և cosmetology։', answer: 'Այո, Freya-ի ակտիվ ծառայությունները, ներառյալ hair, nails, cosmetology, massage և այլ beauty կատեգորիաներ, հասանելի են օնլայն ամրագրման համար։' },
        ],
      }
    }

    if (pageKey === 'masters') {
      if (brand === 'tor') {
        if (locale.value === 'ru') {
          return {
            eyebrow: 'FAQ',
            title: 'Вопросы о барберах',
            lead: 'Короткие ответы о барберах Tor, записи и выборе мастера.',
            items: [
              { question: 'Можно ли выбрать конкретного барбера?', answer: 'Да, при записи вы можете выбрать конкретного барбера, если у него есть свободные слоты.' },
              { question: 'Все ли барберы выполняют fade и beard trim?', answer: 'На странице профиля мастера указаны его специализации и доступные услуги.' },
              { question: 'Как понять, какой барбер мне подходит?', answer: 'Смотрите профиль, специализации, опыт и доступные услуги каждого мастера.' },
              { question: 'Можно ли записаться к барберу онлайн?', answer: 'Да, запись к доступным барберам оформляется онлайн через сайт.' },
            ],
          }
        }

        if (locale.value === 'en') {
          return {
            eyebrow: 'FAQ',
            title: 'Barber Questions',
            lead: 'Short answers about Tor barbers, online booking, and choosing the right specialist.',
            items: [
              { question: 'Can I choose a specific barber?', answer: 'Yes, during booking you can choose a specific barber if they have available time slots.' },
              { question: 'Do all barbers provide fades and beard trims?', answer: 'Each barber profile lists their specializations and available services.' },
              { question: 'How do I choose the right barber?', answer: 'Check each profile for services, specializations, experience, and availability.' },
              { question: 'Can I book a barber online?', answer: 'Yes, available barbers can be booked online through the website.' },
            ],
          }
        }

        return {
          eyebrow: 'FAQ',
          title: 'Բարբերների մասին հարցեր',
          lead: 'Կարճ պատասխաններ Tor-ի բարբերների, օնլայն ամրագրման և մասնագետ ընտրելու մասին։',
          items: [
            { question: 'Կարո՞ղ եմ ընտրել կոնկրետ բարբերի։', answer: 'Այո, ամրագրման ընթացքում կարող եք ընտրել կոնկրետ բարբերի, եթե նա ազատ ժամեր ունի։' },
            { question: 'Բոլոր բարբերնե՞րն են անում fade և beard trim։', answer: 'Յուրաքանչյուր բարբերի էջում նշված են նրա մասնագիտացումները և հասանելի ծառայությունները։' },
            { question: 'Ինչպե՞ս ընտրել ինձ հարմար բարբերի։', answer: 'Դիտեք յուրաքանչյուր մասնագետի էջը, փորձը, ծառայությունները և մասնագիտացումները։' },
            { question: 'Հնարավո՞ր է բարբերին օնլայն ամրագրել։', answer: 'Այո, հասանելի բարբերներին կարելի է օնլայն ամրագրել կայքի միջոցով։' },
          ],
        }
      }

      if (locale.value === 'ru') {
        return {
          eyebrow: 'FAQ',
          title: 'Вопросы о мастерах',
          lead: 'Короткие ответы о специалистах Freya, записи и выборе мастера.',
          items: [
            { question: 'Можно ли выбрать конкретного мастера?', answer: 'Да, при записи вы можете выбрать конкретного мастера, если у него есть свободные слоты.' },
            { question: 'Как посмотреть специализацию мастера?', answer: 'На странице каждого мастера указаны его услуги, опыт и направления работы.' },
            { question: 'Можно ли записаться к мастеру онлайн?', answer: 'Да, запись к доступным мастерам оформляется онлайн через сайт.' },
            { question: 'Как выбрать подходящего специалиста?', answer: 'Смотрите профиль мастера, специализацию, опыт и услуги, которые он выполняет.' },
          ],
        }
      }

      if (locale.value === 'en') {
        return {
          eyebrow: 'FAQ',
          title: 'Specialist Questions',
          lead: 'Short answers about Freya specialists, online booking, and choosing the right master.',
          items: [
            { question: 'Can I choose a specific specialist?', answer: 'Yes, during booking you can choose a specific specialist if they have available time slots.' },
            { question: 'How can I view a specialist’s services?', answer: 'Each specialist profile includes services, experience, and focus areas.' },
            { question: 'Can I book a specialist online?', answer: 'Yes, available specialists can be booked online through the website.' },
            { question: 'How do I choose the right master?', answer: 'Check the profile, specializations, experience, and listed services for each specialist.' },
          ],
        }
      }

      return {
        eyebrow: 'FAQ',
        title: 'Մասնագետների մասին հարցեր',
        lead: 'Կարճ պատասխաններ Freya-ի մասնագետների, օնլայն ամրագրման և ճիշտ վարպետ ընտրելու մասին։',
        items: [
          { question: 'Կարո՞ղ եմ ընտրել կոնկրետ մասնագետի։', answer: 'Այո, ամրագրման ընթացքում կարող եք ընտրել կոնկրետ մասնագետի, եթե նա ազատ ժամեր ունի։' },
          { question: 'Ինչպե՞ս տեսնել մասնագետի ծառայությունները։', answer: 'Յուրաքանչյուր մասնագետի էջում նշված են նրա ծառայությունները, փորձը և ուղղությունները։' },
          { question: 'Հնարավո՞ր է մասնագետին օնլայն ամրագրել։', answer: 'Այո, հասանելի մասնագետներին կարելի է օնլայն ամրագրել կայքի միջոցով։' },
          { question: 'Ինչպե՞ս ընտրել ինձ հարմար վարպետին։', answer: 'Դիտեք մասնագետի էջը, փորձը, մասնագիտացումները և մատուցվող ծառայությունները։' },
        ],
      }
    }

    if (pageKey === 'privacy-policy') {
      if (brand === 'tor') {
        if (locale.value === 'ru') {
          return {
            eyebrow: 'FAQ',
            title: 'Вопросы о политике',
            lead: 'Короткие ответы о персональных данных, отменах и условиях Tor Barbershop.',
            items: [
              { question: 'Какие данные вы собираете?', answer: 'Мы обрабатываем только данные, необходимые для записи, связи, заказов и оплаты.' },
              { question: 'Можно ли отменить запись?', answer: 'Да, запись можно отменить до начала оказания услуги.' },
              { question: 'Передаете ли вы данные третьим лицам?', answer: 'Данные передаются только техническим и платежным провайдерам, необходимым для работы сервиса.' },
              { question: 'Как связаться по вопросам персональных данных?', answer: 'Контактные данные указаны на странице политики и на странице контактов.' },
            ],
          }
        }

        if (locale.value === 'en') {
          return {
            eyebrow: 'FAQ',
            title: 'Policy Questions',
            lead: 'Short answers about personal data, cancellations, and Tor Barbershop terms.',
            items: [
              { question: 'What data do you collect?', answer: 'We only process the data required for bookings, communication, orders, and payments.' },
              { question: 'Can I cancel a booking?', answer: 'Yes, a booking may be cancelled before the service begins.' },
              { question: 'Do you share data with third parties?', answer: 'Data is shared only with technical and payment providers required to operate the service.' },
              { question: 'How can I contact you about personal data?', answer: 'Contact details are listed on the policy page and the contacts page.' },
            ],
          }
        }

        return {
          eyebrow: 'FAQ',
          title: 'Քաղաքականության հարցեր',
          lead: 'Կարճ պատասխաններ անձնական տվյալների, չեղարկումների և Tor Barbershop-ի պայմանների մասին։',
          items: [
            { question: 'Ի՞նչ տվյալներ եք հավաքում։', answer: 'Մենք մշակում ենք միայն ամրագրման, կապի, պատվերների և վճարումների համար անհրաժեշտ տվյալները։' },
            { question: 'Հնարավո՞ր է չեղարկել ամրագրումը։', answer: 'Այո, ամրագրումը կարելի է չեղարկել մինչև ծառայության մեկնարկը։' },
            { question: 'Տվյալները փոխանցվու՞մ են երրորդ կողմերին։', answer: 'Տվյալները փոխանցվում են միայն ծառայության աշխատանքի համար անհրաժեշտ տեխնիկական և վճարային գործընկերներին։' },
            { question: 'Ինչպե՞ս կապվել անձնական տվյալների հարցերով։', answer: 'Կոնտակտային տվյալները նշված են քաղաքականության և կոնտակտների էջերում։' },
          ],
        }
      }

      if (locale.value === 'ru') {
        return {
          eyebrow: 'FAQ',
          title: 'Вопросы о политике',
          lead: 'Короткие ответы о персональных данных, отменах и условиях Freya Beauty Salon.',
          items: [
            { question: 'Какие данные вы собираете?', answer: 'Мы обрабатываем только данные, необходимые для записи, связи, заказов и оплаты.' },
            { question: 'Можно ли отменить запись?', answer: 'Да, запись можно отменить до начала оказания услуги.' },
            { question: 'Передаете ли вы данные третьим лицам?', answer: 'Данные передаются только техническим и платежным провайдерам, необходимым для работы сервиса.' },
            { question: 'Как связаться по вопросам персональных данных?', answer: 'Контактные данные указаны на странице политики и на странице контактов.' },
          ],
        }
      }

      if (locale.value === 'en') {
        return {
          eyebrow: 'FAQ',
          title: 'Policy Questions',
          lead: 'Short answers about personal data, cancellations, and Freya Beauty Salon terms.',
          items: [
            { question: 'What data do you collect?', answer: 'We only process the data required for bookings, communication, orders, and payments.' },
            { question: 'Can I cancel a booking?', answer: 'Yes, a booking may be cancelled before the service begins.' },
            { question: 'Do you share data with third parties?', answer: 'Data is shared only with technical and payment providers required to operate the service.' },
            { question: 'How can I contact you about personal data?', answer: 'Contact details are listed on the policy page and the contacts page.' },
          ],
        }
      }

      return {
        eyebrow: 'FAQ',
        title: 'Քաղաքականության հարցեր',
        lead: 'Կարճ պատասխաններ անձնական տվյալների, չեղարկումների և Freya Beauty Salon-ի պայմանների մասին։',
        items: [
          { question: 'Ի՞նչ տվյալներ եք հավաքում։', answer: 'Մենք մշակում ենք միայն ամրագրման, կապի, պատվերների և վճարումների համար անհրաժեշտ տվյալները։' },
          { question: 'Հնարավո՞ր է չեղարկել ամրագրումը։', answer: 'Այո, ամրագրումը կարելի է չեղարկել մինչև ծառայության մեկնարկը։' },
          { question: 'Տվյալները փոխանցվու՞մ են երրորդ կողմերին։', answer: 'Տվյալները փոխանցվում են միայն ծառայության աշխատանքի համար անհրաժեշտ տեխնիկական և վճարային գործընկերներին։' },
          { question: 'Ինչպե՞ս կապվել անձնական տվյալների հարցերով։', answer: 'Կոնտակտային տվյալները նշված են քաղաքականության և կոնտակտների էջերում։' },
        ],
      }
    }

    if (pageKey === 'services') {
      if (brand === 'tor') {
        if (locale.value === 'ru') {
          return {
            eyebrow: 'FAQ',
            title: 'Вопросы об услугах',
            lead: 'Короткие ответы о стрижках, бороде, длительности и записи в Tor.',
          items: [
            { question: 'Какие услуги доступны в Tor?', answer: 'В Tor доступны мужские стрижки, fade, beard trim, бритье и другие барбер-услуги.' },
            { question: 'Есть ли в Tor мужской маникюр, педикюр и дополнительные мужские процедуры?', answer: 'Актуальный список мужских услуг, включая маникюр, педикюр и уходовые процедуры, представлен в каталоге.' },
            { question: 'Доступны ли мужская эпиляция, воск и ELOS-процедуры?', answer: 'Доступность эпиляции, восковых и ELOS-процедур можно проверить в текущем каталоге услуг.' },
            { question: 'Как узнать длительность услуги?', answer: 'Время выполнения указано рядом с каждой услугой на странице.' },
            { question: 'Можно ли записаться сразу с выбранной услугой?', answer: 'Да, кнопка записи рядом с услугой ведет прямо в бронирование.' },
            { question: 'От чего зависит цена услуги?', answer: 'Цена зависит от конкретной услуги и может отличаться по диапазону, если это указано в карточке.' },
            ],
          }
        }

        if (locale.value === 'en') {
          return {
            eyebrow: 'FAQ',
            title: 'Service Questions',
            lead: 'Short answers about cuts, beard work, duration, and booking in Tor.',
          items: [
            { question: 'What services are available in Tor?', answer: 'Tor offers men’s cuts, fades, beard trims, shaving, and other barbershop services.' },
            { question: 'Does Tor offer men’s manicure, pedicure, and additional care services?', answer: 'The current list of men’s services, including manicure, pedicure, and care treatments, is available in the service catalog.' },
            { question: 'Are men’s epilation, waxing, and ELOS treatments available?', answer: 'Check the current service catalog for the availability of epilation, waxing, and ELOS treatments.' },
            { question: 'How can I check the service duration?', answer: 'The duration is shown next to each listed service on the page.' },
            { question: 'Can I book directly from a service card?', answer: 'Yes, each service card includes a booking button that opens the booking flow.' },
            { question: 'What affects the service price?', answer: 'The price depends on the selected service and may be shown as a range when applicable.' },
            ],
          }
        }

        return {
          eyebrow: 'FAQ',
          title: 'Ծառայությունների հարցեր',
          lead: 'Կարճ պատասխաններ Tor-ի սանրվածքների, մորուքի խնամքի, տևողության և ամրագրման մասին։',
        items: [
          { question: 'Ի՞նչ ծառայություններ կան Tor-ում։', answer: 'Tor-ում հասանելի են տղամարդկանց սանրվածքներ, fade, beard trim, սափրում և այլ բարբեր ծառայություններ։' },
          { question: 'Tor-ում կա՞ տղամարդկանց manicure, pedicure և այլ խնամք։', answer: 'Տղամարդկանց ընթացիկ ծառայությունների ցանկը, ներառյալ manicure-ը, pedicure-ը և խնամքի պրոցեդուրաները, ներկայացված է կատալոգում։' },
          { question: 'Հասանելի՞ են տղամարդկանց epilation, waxing և ELOS պրոցեդուրաները։', answer: 'Epilation, waxing և ELOS պրոցեդուրաների հասանելիությունը կարող եք ստուգել ծառայությունների ընթացիկ կատալոգում։' },
          { question: 'Ինչպե՞ս տեսնել ծառայության տևողությունը։', answer: 'Տևողությունը նշված է յուրաքանչյուր ծառայության կողքին էջում։' },
          { question: 'Հնարավո՞ր է ամրագրել հենց ծառայության քարտից։', answer: 'Այո, յուրաքանչյուր ծառայության քարտում կա ամրագրման կոճակ։' },
          { question: 'Ինչի՞ց է կախված գինը։', answer: 'Գինը կախված է ընտրված ծառայությունից և կարող է նշված լինել որպես միջակայք։' },
          ],
        }
      }

      if (locale.value === 'ru') {
        return {
          eyebrow: 'FAQ',
          title: 'Вопросы об услугах',
          lead: 'Короткие ответы о категориях, длительности, цене и записи на услуги Freya.',
          items: [
            { question: 'Какие услуги доступны в Freya?', answer: 'В Freya доступны услуги для волос, ногтей, бровей и ресниц, макияжа, косметологии, массажа и ухода.' },
            { question: 'Есть ли в каталоге маникюр, педикюр, эпиляция и мужские услуги?', answer: 'Да, в каталоге представлены маникюр, педикюр, эпиляция, косметология, массаж и отдельные услуги для мужчин.' },
            { question: 'Как узнать длительность услуги?', answer: 'В карточке каждой услуги указана длительность в минутах.' },
            { question: 'Можно ли записаться на услугу онлайн?', answer: 'Да, через сайт можно выбрать услугу и перейти к онлайн-записи.' },
            { question: 'Почему у некоторых услуг указан диапазон цены?', answer: 'Диапазон цены зависит от объема работы, техники и конкретного запроса по услуге.' },
          ],
        }
      }

      if (locale.value === 'en') {
        return {
          eyebrow: 'FAQ',
          title: 'Service Questions',
          lead: 'Short answers about categories, duration, pricing, and online booking for Freya services.',
          items: [
            { question: 'What services are available at Freya?', answer: 'Freya offers hair, nails, brows and lashes, makeup, cosmetology, massage, and beauty care services.' },
            { question: 'Does the catalog include manicure, pedicure, epilation, and men’s services?', answer: 'Yes, the Freya catalog includes manicure, pedicure, epilation, waxing, cosmetology, massage, and selected men’s beauty services.' },
            { question: 'How can I check the service duration?', answer: 'Each service card shows the estimated duration in minutes.' },
            { question: 'Can I book a service online?', answer: 'Yes, you can select a service on the site and continue to online booking.' },
            { question: 'Why do some services show a price range?', answer: 'A price range may depend on the amount of work, technique, or the selected service format.' },
          ],
        }
      }

      return {
        eyebrow: 'FAQ',
        title: 'Ծառայությունների հարցեր',
        lead: 'Կարճ պատասխաններ Freya-ի ծառայությունների, տևողության, գների և օնլայն ամրագրման մասին։',
        items: [
          { question: 'Ի՞նչ ծառայություններ կան Freya-ում։', answer: 'Freya-ում հասանելի են մազերի, եղունգների, հոնքերի և թարթիչների, դիմահարդարման, կոսմետոլոգիայի, մերսման և խնամքի ծառայություններ։' },
          { question: 'Կատալոգում կա՞ն manicure, pedicure, epilation և տղամարդկանց ծառայություններ։', answer: 'Այո, Freya-ի կատալոգում ներկայացված են manicure, pedicure, epilation, waxing, cosmetology, massage և որոշ տղամարդկանց ծառայություններ։' },
          { question: 'Ինչպե՞ս տեսնել ծառայության տևողությունը։', answer: 'Յուրաքանչյուր ծառայության քարտում նշված է դրա տևողությունը րոպեներով։' },
          { question: 'Հնարավո՞ր է ծառայությունը օնլայն ամրագրել։', answer: 'Այո, կայքում կարող եք ընտրել ծառայությունը և անցնել օնլայն ամրագրման։' },
          { question: 'Ինչո՞ւ է որոշ ծառայությունների մոտ գների միջակայք նշված։', answer: 'Գների միջակայքը կարող է կախված լինել աշխատանքի ծավալից, տեխնիկայից կամ ընտրված ծառայության ձևաչափից։' },
        ],
      }
    }

    if (pageKey === 'contacts') {
      if (brand === 'tor') {
        if (locale.value === 'ru') {
          return {
            eyebrow: 'FAQ',
            title: 'Вопросы о контактах',
            lead: 'Короткие ответы о записи, адресе, маршруте и графике Tor Barbershop.',
            items: [
              { question: 'Где находится Tor Barbershop?', answer: 'Tor Barbershop находится в Ереване по адресу Азатутян 21.' },
              { question: 'Как записаться в Tor?', answer: 'Вы можете записаться онлайн через сайт и выбрать удобное время визита.' },
              { question: 'Какой у вас график работы?', answer: 'Барбершоп работает ежедневно с 10:00 до 19:00.' },
              { question: 'Можно ли открыть маршрут в навигаторе?', answer: 'Да, на странице контактов есть быстрые кнопки для открытия маршрута в Yandex и Google Maps.' },
            ],
          }
        }

        if (locale.value === 'en') {
          return {
            eyebrow: 'FAQ',
            title: 'Contact Questions',
            lead: 'Short answers about booking, address, routes, and working hours at Tor Barbershop.',
            items: [
              { question: 'Where is Tor Barbershop located?', answer: 'Tor Barbershop is located at 21 Azatutyan, Yerevan.' },
              { question: 'How can I book an appointment?', answer: 'You can book online through the website and choose a suitable time slot.' },
              { question: 'What are your working hours?', answer: 'The barbershop is open daily from 10:00 to 19:00.' },
              { question: 'Can I open a route in navigation apps?', answer: 'Yes, the contacts page includes quick links for Yandex and Google Maps routes.' },
            ],
          }
        }

        return {
          eyebrow: 'FAQ',
          title: 'Կոնտակտների հարցեր',
          lead: 'Կարճ պատասխաններ Tor Barbershop-ի հասցեի, ամրագրման, երթուղու և գրաֆիկի մասին։',
          items: [
            { question: 'Որտե՞ղ է գտնվում Tor Barbershop-ը։', answer: 'Tor Barbershop-ը գտնվում է Երևանում, Ազատության 21 հասցեում։' },
            { question: 'Ինչպե՞ս ամրագրել այցը։', answer: 'Կարող եք օնլայն ամրագրել կայքի միջոցով և ընտրել ձեզ հարմար ժամը։' },
            { question: 'Ո՞ր ժամերին եք աշխատում։', answer: 'Բարբեր շոփը աշխատում է ամեն օր՝ 10:00-ից 19:00։' },
            { question: 'Հնարավո՞ր է բացել երթուղին նավիգացիայում։', answer: 'Այո, կոնտակտների էջում կան արագ հղումներ Yandex և Google Maps երթուղիների համար։' },
          ],
        }
      }

      if (locale.value === 'ru') {
        return {
          eyebrow: 'FAQ',
          title: 'Вопросы о контактах',
          lead: 'Короткие ответы о записи, адресе, маршруте и графике Freya Beauty Salon.',
          items: [
            { question: 'Где находится Freya Beauty Salon?', answer: 'Салон находится в Ереване по адресу Азатутян 21.' },
            { question: 'Как записаться в салон?', answer: 'Вы можете записаться онлайн через сайт и выбрать удобное время визита.' },
            { question: 'Какой у вас график работы?', answer: 'Салон работает ежедневно с 10:00 до 19:00.' },
            { question: 'Можно ли открыть маршрут в навигаторе?', answer: 'Да, на странице контактов есть быстрые кнопки для открытия маршрута в Yandex и Google Maps.' },
          ],
        }
      }

      if (locale.value === 'en') {
        return {
          eyebrow: 'FAQ',
          title: 'Contact Questions',
          lead: 'Short answers about booking, address, routes, and working hours at Freya Beauty Salon.',
          items: [
            { question: 'Where is Freya Beauty Salon located?', answer: 'Freya Beauty Salon is located at 21 Azatutyan, Yerevan.' },
            { question: 'How can I book an appointment?', answer: 'You can book online through the website and choose a suitable time slot.' },
            { question: 'What are your working hours?', answer: 'The salon is open daily from 10:00 to 19:00.' },
            { question: 'Can I open a route in navigation apps?', answer: 'Yes, the contacts page includes quick links for Yandex and Google Maps routes.' },
          ],
        }
      }

      return {
        eyebrow: 'FAQ',
        title: 'Կոնտակտների հարցեր',
        lead: 'Կարճ պատասխաններ Freya Beauty Salon-ի հասցեի, ամրագրման, երթուղու և գրաֆիկի մասին։',
        items: [
          { question: 'Որտե՞ղ է գտնվում Freya Beauty Salon-ը։', answer: 'Սրահը գտնվում է Երևանում, Ազատության 21 հասցեում։' },
          { question: 'Ինչպե՞ս ամրագրել այցը։', answer: 'Կարող եք օնլայն ամրագրել կայքի միջոցով և ընտրել ձեզ հարմար ժամը։' },
          { question: 'Ո՞ր ժամերին եք աշխատում։', answer: 'Սրահը աշխատում է ամեն օր՝ 10:00-ից 19:00։' },
          { question: 'Հնարավո՞ր է բացել երթուղին նավիգացիայում։', answer: 'Այո, կոնտակտների էջում կան արագ հղումներ Yandex և Google Maps երթուղիների համար։' },
        ],
      }
    }

    if (brand === 'tor') {
      if (locale.value === 'ru') {
        return {
          eyebrow: 'FAQ',
          title: 'Частые вопросы',
          lead: 'Короткие ответы о мужских стрижках, бороде, записи и товарах Tor Barbershop.',
          items: [
            { question: 'Какие услуги есть в Tor Barbershop?', answer: 'Tor специализируется на мужских стрижках, fade, оформлении бороды, бритье и мужском уходе.' },
            { question: 'Делаете ли вы fade и beard trim?', answer: 'Да, в Tor доступны fade, окантовка, коррекция формы бороды и другие барбер-услуги.' },
            { question: 'Есть ли в Tor мужской маникюр, педикюр и уходовые процедуры?', answer: 'Доступные мужские процедуры представлены в каталоге услуг Tor.' },
            { question: 'Есть ли мужская эпиляция, воск и ELOS-процедуры?', answer: 'Проверьте каталог услуг: в нём всегда указан актуальный список доступных процедур.' },
            { question: 'Нужно ли записываться заранее?', answer: 'Да, лучше бронировать время заранее, особенно если вы хотите попасть к конкретному барберу.' },
            { question: 'Сколько длится мужская стрижка?', answer: 'Точная длительность зависит от услуги, но она всегда указана на сайте рядом с каждой позицией.' },
            { question: 'Есть ли у вас товары для домашнего ухода?', answer: 'Да, на сайте доступны товары для бороды, бритья, волос и ежедневного мужского ухода.' },
            { question: 'Где находится Tor Barbershop?', answer: 'Tor находится в Ереване по адресу Азатутян 21. На странице контактов доступны карта и быстрые маршруты.' },
          ],
        }
      }

      if (locale.value === 'en') {
        return {
          eyebrow: 'FAQ',
          title: 'Frequently Asked Questions',
          lead: 'Short answers about men’s cuts, beard work, bookings, and grooming products at Tor Barbershop.',
          items: [
            { question: 'What services are available at Tor Barbershop?', answer: 'Tor focuses on men’s haircuts, fades, beard shaping, shaving, and male grooming services.' },
            { question: 'Do you offer fade cuts and beard trims?', answer: 'Yes, Tor offers fades, line-ups, beard contour work, and other core barbershop services.' },
            { question: 'Does Tor offer men’s manicure, pedicure, and care treatments?', answer: 'All currently available men’s treatments are listed in the Tor service catalog.' },
            { question: 'Are men’s epilation, waxing, and ELOS treatments available?', answer: 'Check the service catalog for the current list of available treatments.' },
            { question: 'Do I need to book in advance?', answer: 'Yes, booking ahead is recommended, especially if you want a specific barber or peak time slot.' },
            { question: 'How long does a men’s haircut take?', answer: 'The exact duration depends on the service, and it is shown on the website for each listed option.' },
            { question: 'Do you sell grooming products?', answer: 'Yes, the site includes grooming products for beard care, shaving, styling, and daily maintenance.' },
            { question: 'Where is Tor Barbershop located?', answer: 'Tor is located at 21 Azatutyan, Yerevan. The contacts page includes the map and route links.' },
          ],
        }
      }

      return {
        eyebrow: 'FAQ',
        title: 'Հաճախ տրվող հարցեր',
        lead: 'Կարճ պատասխաններ տղամարդկանց սանրվածքների, մորուքի խնամքի, ամրագրման և Tor Barbershop ապրանքների մասին։',
        items: [
          { question: 'Ի՞նչ ծառայություններ կան Tor Barbershop-ում։', answer: 'Tor-ը մասնագիտացած է տղամարդկանց սանրվածքի, fade-ի, մորուքի ձևավորման, սափրման և տղամարդկանց խնամքի ծառայությունների վրա։' },
          { question: 'Անո՞ւմ եք fade և beard trim։', answer: 'Այո, Tor-ում հասանելի են fade, եզրագծում, մորուքի ձևավորում և դասական բարբեր ծառայություններ։' },
          { question: 'Tor-ում կա՞ տղամարդկանց manicure, pedicure և խնամքի պրոցեդուրաներ։', answer: 'Tor-ի ծառայությունների կատալոգում ներկայացված են տվյալ պահին հասանելի բոլոր տղամարդկանց պրոցեդուրաները։' },
          { question: 'Հասանելի՞ են տղամարդկանց epilation, waxing և ELOS պրոցեդուրաները։', answer: 'Ծառայությունների կատալոգում միշտ նշված է տվյալ պահին հասանելի պրոցեդուրաների ցանկը։' },
          { question: 'Պե՞տք է նախապես ամրագրել։', answer: 'Այո, խորհուրդ է տրվում նախապես ամրագրել, հատկապես եթե ցանկանում եք կոնկրետ բարբեր կամ պահանջված ժամ։' },
          { question: 'Որքա՞ն է տևում տղամարդկանց սանրվածքը։', answer: 'Ճշգրիտ տևողությունը կախված է ծառայությունից, և այն նշված է կայքում յուրաքանչյուր ծառայության կողքին։' },
          { question: 'Ունե՞ք տնային խնամքի ապրանքներ։', answer: 'Այո, կայքում ներկայացված են մորուքի, սափրման, հարդարման և ամենօրյա խնամքի ապրանքներ։' },
          { question: 'Որտե՞ղ է գտնվում Tor Barbershop-ը։', answer: 'Tor-ը գտնվում է Երևանում, Ազատության 21 հասցեում։ Կոնտակտների էջում կա քարտեզ և երթուղու արագ հղումներ։' },
        ],
      }
    }

    if (locale.value === 'ru') {
      return {
        eyebrow: 'FAQ',
        title: 'Частые вопросы',
        lead: 'Короткие ответы на вопросы о записи, услугах и визите в Freya Beauty Salon.',
        items: [
          { question: 'Какие услуги есть в Freya Beauty Salon?', answer: 'В Freya доступны услуги для волос, ногтей, бровей и ресниц, макияж, косметология, массаж и другие уходовые процедуры.' },
          { question: 'Есть ли в салоне маникюр, педикюр, массаж и косметология?', answer: 'Да, на сайте Freya представлены направления маникюра, педикюра, массажа, косметологии, а также уходовые beauty-услуги для женщин и мужчин.' },
          { question: 'Доступны ли эпиляция, воск, мужской маникюр и процедуры для мужчин?', answer: 'Да, в зависимости от актуального каталога Freya закрывает запросы по эпиляции, wax-уходу, мужскому маникюру и другим услугам для мужчин. Точные позиции смотрите в каталоге услуг.' },
          { question: 'Как записаться в салон?', answer: 'Вы можете записаться онлайн через сайт, выбрать категорию, услугу, мастера и удобное время визита.' },
          { question: 'Нужно ли записываться заранее?', answer: 'Да, предварительная запись желательна, особенно на популярные часы и к конкретным мастерам.' },
          { question: 'Где находится Freya Beauty Salon?', answer: 'Салон находится в Ереване по адресу Азатутян 21. На странице контактов есть карта и быстрые ссылки на маршрут.' },
          { question: 'Можно ли оплатить картой?', answer: 'Да, на сайте предусмотрены современные способы оплаты, а детали доступны при оформлении записи или заказа.' },
          { question: 'Можно ли выбрать мастера при записи?', answer: 'Да, если для услуги доступны специалисты, вы сможете выбрать мастера во время бронирования.' },
          { question: 'Есть ли подарочные карты и уходовые продукты?', answer: 'Да, Freya предлагает подарочные карты и продает уходовые продукты через отдельные страницы сайта.' },
        ],
      }
    }

    if (locale.value === 'en') {
      return {
        eyebrow: 'FAQ',
        title: 'Frequently Asked Questions',
        lead: 'Short answers about booking, services, and your visit to Freya Beauty Salon.',
        items: [
          { question: 'What services are available at Freya Beauty Salon?', answer: 'Freya offers hair, nails, brows and lashes, makeup, cosmetology, massage, and other beauty care services.' },
          { question: 'Do you offer manicure, pedicure, massage, and cosmetology?', answer: 'Yes, Freya covers manicure, pedicure, massage, cosmetology, and a broad range of beauty services for both women and men.' },
          { question: 'Are epilation, waxing, men’s manicure, and men’s treatments available?', answer: 'Yes, depending on the active catalog, Freya supports epilation, waxing, men’s manicure, and other men’s beauty service intent. The current list is shown in the service catalog.' },
          { question: 'How can I book an appointment?', answer: 'You can book online through the website by selecting a category, service, specialist, and available time slot.' },
          { question: 'Do I need to book in advance?', answer: 'Yes, booking in advance is recommended, especially for peak hours and popular specialists.' },
          { question: 'Where is Freya Beauty Salon located?', answer: 'The salon is located at 21 Azatutyan, Yerevan. The contacts page includes a map and route links.' },
          { question: 'Can I pay by card?', answer: 'Yes, the site supports modern payment methods, and the available options are shown during booking or checkout.' },
          { question: 'Can I choose a specialist when booking?', answer: 'Yes, when a service is linked to specialists, you can choose the one you prefer during the booking flow.' },
          { question: 'Do you offer gift cards and beauty products?', answer: 'Yes, Freya offers gift cards and sells beauty care products through dedicated pages on the website.' },
        ],
      }
    }

    return {
      eyebrow: 'FAQ',
      title: 'Հաճախ տրվող հարցեր',
      lead: 'Կարճ պատասխաններ ամրագրման, ծառայությունների և Freya Beauty Salon այցի մասին։',
      items: [
        { question: 'Ի՞նչ ծառայություններ կան Freya Beauty Salon-ում։', answer: 'Freya-ում հասանելի են մազերի, եղունգների, հոնքերի և թարթիչների, դիմահարդարման, կոսմետոլոգիայի, մերսման և այլ խնամքի ծառայություններ։' },
        { question: 'Ունե՞ք մանիկյուր, պեդիկյուր, մերսում և կոսմետոլոգիա։', answer: 'Այո, Freya-ում ներկայացված են manicure, pedicure, massage, cosmetology և կանանց ու տղամարդկանց beauty ծառայությունների ուղղություններ։' },
        { question: 'Հասանելի՞ են էպիլյացիա, waxing, տղամարդկանց manicure և տղամարդկանց ծառայություններ։', answer: 'Այո, ըստ ակտիվ կատալոգի Freya-ում կարող են լինել էպիլյացիա, waxing, տղամարդկանց manicure և այլ տղամարդկանց beauty ծառայություններ։ Մանրամասները տեսեք ծառայությունների էջում։' },
        { question: 'Ինչպե՞ս ամրագրել այցը։', answer: 'Կարող եք օնլայն ամրագրել կայքի միջոցով, ընտրել կատեգորիան, ծառայությունը, մասնագետին և հարմար ժամը։' },
        { question: 'Պե՞տք է նախապես ամրագրել։', answer: 'Այո, նախնական ամրագրումը ցանկալի է, հատկապես պահանջված ժամերի և կոնկրետ մասնագետների համար։' },
        { question: 'Որտե՞ղ է գտնվում Freya Beauty Salon-ը։', answer: 'Սրահը գտնվում է Երևանում, Ազատության 21 հասցեում։ Կոնտակտների էջում կա քարտեզ և երթուղու հղումներ։' },
        { question: 'Կարո՞ղ եմ քարտով վճարել։', answer: 'Այո, կայքում հասանելի են ժամանակակից վճարման տարբերակներ, իսկ մանրամասները երևում են ամրագրման կամ պատվերի ընթացքում։' },
        { question: 'Հնարավո՞ր է ամրագրման ժամանակ ընտրել մասնագետին։', answer: 'Այո, եթե ծառայությանը կցված են մասնագետներ, կարող եք ընտրել նախընտրած վարպետին ամրագրման ընթացքում։' },
        { question: 'Ունե՞ք նվեր քարտեր և խնամքի ապրանքներ։', answer: 'Այո, Freya-ն առաջարկում է նվեր քարտեր և խնամքի ապրանքներ կայքի առանձին էջերում։' },
      ],
    }
  })
}
