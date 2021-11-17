const Shop = require('../db/models/company');
const fs = require('fs');
const { Parser } = require('json2csv');

class ShopController {

  async showShop(req, res) {
    const { q, sort, countmin, countmax } = req.query;
    const page = req.query.page || 1;
    const perPage = 2;

    const where = {};

    // search
    if (q) {
      where.name = { $regex: q, $options: 'i'};
    }

    // filters
    if (countmin || countmax) {
      where.price = {};
      if (countmin) where.price.$gte = countmin;
      if (countmax) where.price.$lte = countmax;
    }

    let query = Shop.find(where);

    // pagination
    query = query.skip((page - 1) * perPage);
    query = query.limit(perPage);

    // sorting
    if (sort) {
      const s = sort.split('|');
      query = query.sort({ [s[0]]: s[1] });
    }

    // exec
    const companies = await query.populate('user').exec();
    const resultsCount = await Shop.find(where).countDocuments();
    const pagesCount = Math.ceil(resultsCount / perPage);

    res.render('pages/companies/companies', {
      companies,
      page,
      pagesCount,
      resultsCount
    });
  }

  async showCompany(req, res) {
    const { name } = req.params;
    const company = await Shop.findOne({ name });
  
    res.render('pages/companies/company', { 
      name: company?.name,
      title: company?.name ?? 'Brak wyników',
    });
  }

  showCreateCompanyForm(req, res) {
    res.render('pages/companies/create');
  }

  async createCompany(req, res) {
    const company = new Shop({
      name: req.body.name,
      des: req.body.des,
      price: req.body.price,
      user: req.session.user._id
    });

    try {
      await company.save();
      res.redirect('/sklep');
    } catch (e) {
      res.render('pages/companies/create', {
        errors: e.errors,
        form: req.body
      });
    }
  }

  async showEditCompanyForm(req, res) {
    const { name } = req.params;
    const company = await Shop.findOne({ name });

    res.render('pages/companies/edit', {
      form: company
    });
  }

  async editCompany(req, res) {
    const { name } = req.params;
    const company = await Shop.findOne({ name });
    company.name = req.body.name;
    company.des = req.body.des;
    company.price = req.body.price;

    if (req.file && company.image) {
      fs.unlinkSync('public/uploads/' + company.image);
    }
    if (req.file) {
      company.image = req.file.filename;
    }


    try {
      await company.save();
      res.redirect('/sklep');
    } catch (e) {
      res.render('pages/companies/edit', {
        errors: e.errors,
        form: req.body
      });
    }
  }

  async deleteCompany(req, res) {
    const { des } = req.params;
    const company = await Shop.findOne({ des });
    try {
      if (company.image) {
        fs.unlinkSync('public/uploads/' + company.image);
      }
      await Shop.deleteOne({ des });
      res.redirect('/sklep');
    } catch (e) {
      //
    }
  }

  async deleteImage(req, res) {
    const { name } = req.params;
    const company = await Shop.findOne({ name });
    try {
      fs.unlinkSync('public/uploads/' + company.image);
      company.image = '';
      await company.save();

      res.redirect('/sklep');
    } catch (e) {
      //
    }
  }

  async getCSV(req, res) {
    const fields = [
      {
        label: 'Nazwa',
        value: 'name'
      },
      {
        label: 'Opis',
        value: 'des'
      },
      {
        label: 'Cena',
        value: 'price'
      },
    ];
    const data = await Shop.find();
    const fileName = 'shop.csv';

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    res.send(csv);
  }

  
}

module.exports = new ShopController();