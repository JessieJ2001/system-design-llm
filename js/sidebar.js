(function() {
  'use strict';

  var TOPICS = [
    { category: 'Start Here', items: [
      { name: 'Design Principles', file: 'design-principles.html' }
    ]},
    { category: 'Foundations', items: [
      { name: 'Networking Fundamentals', file: 'networking-fundamentals.html' },
      { name: 'OS Concepts', file: 'os-concepts.html' },
      { name: 'DNS', file: 'dns.html' },
      { name: 'Observability', file: 'observability.html' }
    ]},
    { category: 'Data & Storage', items: [
      { name: 'Caching', file: 'caching.html' },
      { name: 'Database Sharding', file: 'database-sharding.html' },
      { name: 'Database Replication', file: 'database-replication.html' },
      { name: 'SQL vs. NoSQL', file: 'sql-vs-nosql.html' },
      { name: 'B-Tree vs LSM-Tree', file: 'btree-vs-lsm.html' },
      { name: 'Blob Storage', file: 'blob-storage.html' },
      { name: 'Bloom Filters', file: 'bloom-filters.html' }
    ]},
    { category: 'Networking & Communication', items: [
      { name: 'Load Balancing', file: 'load-balancing.html' },
      { name: 'Proxies', file: 'proxies.html' },
      { name: 'CDN', file: 'cdn.html' },
      { name: 'API Gateway', file: 'api-gateway.html' },
      { name: 'WebSockets', file: 'websockets.html' },
      { name: 'Service Discovery', file: 'service-discovery.html' }
    ]},
    { category: 'Scalability Patterns', items: [
      { name: 'Message Queues', file: 'message-queues.html' },
      { name: 'Consistent Hashing', file: 'consistent-hashing.html' },
      { name: 'Rate Limiting', file: 'rate-limiting.html' },
      { name: 'Microservices', file: 'microservices.html' },
      { name: 'CAP Theorem', file: 'cap-theorem.html' }
    ]},
    { category: 'Reliability & Coordination', items: [
      { name: 'Circuit Breakers', file: 'circuit-breakers.html' },
      { name: 'Distributed Transactions', file: 'distributed-transactions.html' },
      { name: 'Leader Election', file: 'leader-election.html' },
      { name: 'Concurrency Control', file: 'concurrency-control.html' }
    ]},
    { category: 'AI/ML Systems', items: [
      { name: 'LLM Inference', file: 'llm-inference.html' }
    ]},
    { category: 'Interview Prep', items: [
      { name: 'BOE Calculations', file: 'back-of-envelope.html' },
      { name: 'Time Complexity (LLM serving)', file: 'time_complexity.html' },
      { name: 'All Scenarios', file: 'interview-scenarios.html' }
    ]},
    { category: 'Technologies', items: [
      { name: 'All Technologies', file: 'technologies.html' },
      { name: 'Cloud Equivalents', file: 'cloud-equivalents.html' },
      { name: 'Datastores: Comparison', file: 'technologies/comparison-datastores.html' },
      { name: 'Search: Comparison', file: 'technologies/comparison-search.html' },
      { name: 'Analytics: Comparison', file: 'technologies/comparison-analytics.html' },
      { name: 'Caches: Comparison', file: 'technologies/comparison-caches.html' },
      { name: 'Messaging: Comparison', file: 'technologies/comparison-messaging.html' },
      { name: 'Stream Processing: Comparison', file: 'technologies/comparison-stream-processing.html' },
      { name: 'Edge: Comparison', file: 'technologies/comparison-edge.html' },
      { name: 'Storage: Comparison', file: 'technologies/comparison-storage.html' },
      { name: 'Coordination: Comparison', file: 'technologies/comparison-coordination.html' },
      { name: 'Compute: Comparison', file: 'technologies/comparison-compute.html' },
      { name: 'Workflow: Comparison', file: 'technologies/comparison-workflow.html' },
      { name: 'Observability: Comparison', file: 'technologies/comparison-observability.html' },
      { name: 'CDC: Comparison', file: 'technologies/comparison-cdc.html' },
      { name: 'Identity / Secrets / Flags: Comparison', file: 'technologies/comparison-identity-secrets-flags.html' },
      { name: 'ML Serving: Comparison', file: 'technologies/comparison-ml-serving.html' },
      { name: '— Per-tech: datastores —', file: 'technologies.html' },
      { name: 'Redis', file: 'technologies/redis.html' },
      { name: 'PostgreSQL', file: 'technologies/postgresql.html' },
      { name: 'MySQL (InnoDB)', file: 'technologies/mysql.html' },
      { name: 'Cassandra', file: 'technologies/cassandra.html' },
      { name: 'DynamoDB', file: 'technologies/dynamodb.html' },
      { name: 'MongoDB', file: 'technologies/mongodb.html' },
      { name: 'Memcached', file: 'technologies/memcached.html' },
      { name: '— Per-tech: search/messaging —', file: 'technologies.html' },
      { name: 'Elasticsearch / OpenSearch', file: 'technologies/elasticsearch.html' },
      { name: 'Apache Kafka', file: 'technologies/kafka.html' },
      { name: '— Per-tech: edge/storage —', file: 'technologies.html' },
      { name: 'Nginx', file: 'technologies/nginx.html' },
      { name: 'Amazon S3', file: 'technologies/s3.html' },
      { name: '— Per-tech: coordination —', file: 'technologies.html' },
      { name: 'Apache ZooKeeper', file: 'technologies/zookeeper.html' }
    ]}
  ];

  function getCurrentFile() {
    var path = window.location.pathname;
    var parts = path.split('/');
    return parts[parts.length - 1];
  }

  // Detect if we are in a subdirectory of topics/ (e.g., topics/scenarios/, topics/technologies/)
  function getBasePrefix() {
    var path = window.location.pathname;
    if (path.indexOf('/scenarios/') !== -1) {
      return '../';  // from topics/scenarios/ go up to topics/
    }
    if (path.indexOf('/technologies/') !== -1) {
      return '../';  // from topics/technologies/ go up to topics/
    }
    return '';  // already in topics/
  }

  function getHomePrefix() {
    var path = window.location.pathname;
    if (path.indexOf('/scenarios/') !== -1) {
      return '../../';  // from topics/scenarios/ go up to root
    }
    if (path.indexOf('/technologies/') !== -1) {
      return '../../';  // from topics/technologies/ go up to root
    }
    return '../';  // from topics/ go up to root
  }

  function slugify(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function getPageSections() {
    var sections = [];
    var headings = document.querySelectorAll('.section h2, .section h3');
    headings.forEach(function(h) {
      if (!h.id) {
        h.id = slugify(h.textContent);
      }
      sections.push({
        id: h.id,
        text: h.textContent,
        level: h.tagName === 'H3' ? 3 : 2
      });
    });
    return sections;
  }

  function buildSidebar() {
    var currentFile = getCurrentFile();
    var sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.setAttribute('aria-label', 'Navigation');

    // Mobile toggle button
    var toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle sidebar');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(toggle);

    // Sidebar inner wrapper
    var inner = document.createElement('div');
    inner.className = 'sidebar-inner';

    // Home link
    var homePrefix = getHomePrefix();
    var basePrefix = getBasePrefix();
    var homeLink = document.createElement('a');
    homeLink.href = homePrefix + 'index.html';
    homeLink.className = 'sidebar-home';
    homeLink.textContent = 'System Design';
    inner.appendChild(homeLink);

    // On This Page section
    var sections = getPageSections();
    if (sections.length > 0) {
      var onPage = document.createElement('div');
      onPage.className = 'sidebar-group sidebar-on-page';

      var onPageTitle = document.createElement('div');
      onPageTitle.className = 'sidebar-group-title';
      onPageTitle.textContent = 'On This Page';
      onPage.appendChild(onPageTitle);

      var onPageList = document.createElement('ul');
      onPageList.className = 'sidebar-section-list';
      sections.forEach(function(s) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + s.id;
        a.textContent = s.text;
        a.className = 'sidebar-section-link';
        if (s.level === 3) {
          a.classList.add('sidebar-section-sub');
        }
        li.appendChild(a);
        onPageList.appendChild(li);
      });
      onPage.appendChild(onPageList);
      inner.appendChild(onPage);
    }

    // Divider
    var divider = document.createElement('hr');
    divider.className = 'sidebar-divider';
    inner.appendChild(divider);

    // All Topics
    TOPICS.forEach(function(cat) {
      var group = document.createElement('div');
      group.className = 'sidebar-group';

      var title = document.createElement('div');
      title.className = 'sidebar-group-title';
      title.textContent = cat.category;
      group.appendChild(title);

      var ul = document.createElement('ul');
      ul.className = 'sidebar-topic-list';
      cat.items.forEach(function(item) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = basePrefix + item.file;
        a.textContent = item.name;
        a.className = 'sidebar-topic-link';
        if (item.file === currentFile) {
          a.classList.add('active');
        }
        li.appendChild(a);
        ul.appendChild(li);
      });
      group.appendChild(ul);
      inner.appendChild(group);
    });

    sidebar.appendChild(inner);
    document.body.insertBefore(sidebar, document.body.firstChild);

    // Toggle behavior
    toggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      toggle.classList.toggle('open');
    });

    // Close sidebar on link click (mobile)
    sidebar.addEventListener('click', function(e) {
      if (e.target.tagName === 'A' && window.innerWidth <= 1024) {
        sidebar.classList.remove('open');
        toggle.classList.remove('open');
      }
    });

    // Active section tracking on scroll
    if (sections.length > 0) {
      var sectionLinks = sidebar.querySelectorAll('.sidebar-section-link');
      var ticking = false;

      function updateActiveSection() {
        var scrollPos = window.scrollY + 100;
        var current = null;
        sections.forEach(function(s, i) {
          var el = document.getElementById(s.id);
          if (el && el.offsetTop <= scrollPos) {
            current = i;
          }
        });
        sectionLinks.forEach(function(link, i) {
          link.classList.toggle('active', i === current);
        });
        ticking = false;
      }

      window.addEventListener('scroll', function() {
        if (!ticking) {
          requestAnimationFrame(updateActiveSection);
          ticking = true;
        }
      });

      updateActiveSection();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSidebar);
  } else {
    buildSidebar();
  }
})();
