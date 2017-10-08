'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = {};
var phoneRegex = /^\d{10}$/;

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} result of addition
 */
exports.add = function (phone, name, email) {
    if (phoneRegex.test(phone) && name && !phoneBook.hasOwnProperty(phone)) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return false;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {boolean} result of update
 */
exports.update = function (phone, name, email) {
    if (phoneRegex.test(phone) && name) {
        phoneBook[phone] = { name, email };

        return true;
    }

    return false;
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} number of entries
 */
exports.findAndRemove = function (query) {
    let removeCounter = 0;
    if (query) {
        if (query === '*') {
            Object.keys(phoneBook).forEach(property => {
                delete phoneBook[property];
                removeCounter++;
            });
        }
        Object.keys(phoneBook).forEach(phone => {
            const entry = phoneBook[phone];
            if (phone.includes(query)) {
                delete phoneBook[phone];
                removeCounter++;
            }
            Object.keys(entry).forEach(property => {
                if (entry[property] && entry[property].includes(query)) {
                    delete phoneBook[phone];
                    removeCounter++;
                }
            });
        });
    }

    return removeCounter;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} result of addition
 */
exports.find = function (query) {
    if (query) {
        let unsortedResultList = [];
        if (query === '*') {
            unsortedResultList = listWholeBook();
        } else {
            Object.keys(phoneBook).forEach(phone => {
                const entry = phoneBook[phone];
                if (phone.includes(query)) {
                    unsortedResultList.push([entry.name, phoneFormat(phone), entry.email]
                        .filter(val => val)
                        .join(', '));
                }
                Object.keys(entry).forEach(property => {
                    if (entry[property] && entry[property].includes(query)) {
                        unsortedResultList.push([entry.name, phoneFormat(phone), entry.email]
                            .join(', '));
                    }
                });
            });
        }

        return unsortedResultList.sort((a, b) => {
            if (a.split(', ')[0] < b.split(', ')[0]) {
                return -1;
            }
            if (a.split(', ')[0] > b.split(', ')[0]) {
                return 1;
            }

            return 0;
        });
    }
};

function listWholeBook() {
    let unsortedResult = [];
    Object.keys(phoneBook).forEach((phone) => {
        const entry = phoneBook[phone];
        unsortedResult.push([entry.name, phoneFormat(phone), entry.email]
            .filter(val => val)
            .join(', '));
    });

    return unsortedResult;
}

function phoneFormat(phone) {

    return String('+7 (' +
        phone.slice(0, 3) + ') ' +
        phone.slice(3, 6) + '-' +
        phone.slice(6, 8) + '-' + phone.slice(8, 10));

}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    let entryCounter = 0;
    if (csv) {
        csv.split('\n').forEach(entry => {
            let args = entry.split(';');
            if (this.add(args[1], args[0], args[2]) || this.update(args[1], args[0], args[2])) {
                entryCounter++;
            }
        });
    }

    return entryCounter;
};
